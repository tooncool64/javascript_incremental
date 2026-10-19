"""Fetch open geodata for greater Olympia, WA (runs on GitHub Actions).
Each step is independent; failures are logged to data/LOG.txt and the job continues.
"""
import os, sys, json, time, gzip, subprocess, urllib.request, urllib.parse, traceback

OUT = 'data'
os.makedirs(OUT, exist_ok=True)
LOG = open(os.path.join(OUT, 'LOG.txt'), 'a')
def log(*a):
    s = time.strftime('%H:%M:%S ') + ' '.join(str(x) for x in a)
    print(s, flush=True); LOG.write(s + '\n'); LOG.flush()

# Extended area: Westside, Capitol campus, downtown, Eastside, both shores of Budd Inlet, Tumwater edge
S, W, N, E = 47.000, -122.960, 47.080, -122.850
UA = {'User-Agent': 'olympia-drive-sim/1.0 (personal hobby project; contact via github tooncool64)'}

def get(url, data=None, timeout=300, tries=3):
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, data=data, headers=UA)
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read()
        except Exception as e:
            last = e; log('  retry', i + 1, url[:90], repr(e)[:200]); time.sleep(10 * (i + 1))
    raise last

def step(name):
    def deco(fn):
        def run():
            log('== step', name)
            t = time.time()
            try:
                fn(); log('== ok', name, f'{time.time()-t:.0f}s')
            except Exception:
                log('== FAILED', name); log(traceback.format_exc())
        return run
    return deco

@step('osm')
def osm():
    bb = f'{S},{W},{N},{E}'
    q = f'''[out:json][timeout:600][maxsize:1073741824];
(
  way["highway"]({bb});
  way["building"]({bb}); relation["building"]({bb});
  way["building:part"]({bb});
  way["natural"]({bb}); relation["natural"]({bb});
  way["waterway"]({bb}); relation["waterway"]({bb});
  way["water"]({bb}); relation["water"]({bb});
  way["leisure"]({bb}); relation["leisure"]({bb});
  way["landuse"]({bb}); relation["landuse"]({bb});
  way["amenity"]({bb}); relation["amenity"]({bb});
  way["railway"]({bb});
  way["barrier"]({bb});
  way["man_made"]({bb});
  way["bridge"]({bb});
  way["place"]({bb});
  relation["type"="multipolygon"]({bb});
  node["natural"="tree"]({bb});
  node["highway"]({bb});
  node["railway"]({bb});
  node["public_transport"]({bb});
  node["amenity"]({bb});
  node["shop"]({bb});
  node["tourism"]({bb});
  node["leisure"]({bb});
  node["man_made"]({bb});
);
out body;
>;
out skel qt;'''
    for host in ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter',
                 'https://overpass.private.coffee/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter']:
        try:
            log('  overpass', host)
            b = get(host, data=urllib.parse.urlencode({'data': q}).encode(), timeout=900, tries=2)
            j = json.loads(b)
            log('  elements', len(j.get('elements', [])), 'bytes', len(b))
            if len(j.get('elements', [])) < 1000: raise RuntimeError('too few elements')
            with gzip.open(os.path.join(OUT, 'osm_olympia.json.gz'), 'wb', compresslevel=9) as f:
                f.write(b)
            return
        except Exception as e:
            log('  overpass failed', host, repr(e)[:300])
    raise RuntimeError('all overpass hosts failed')

@step('dem_3dep_imageserver')
def dem():
    # USGS 3DEP seamless bare-earth DEM (best available, 1 m lidar here) resampled to ~2 m, in UTM 10N
    # Project AOI to UTM zone 10N (EPSG:26910) for square pixels.
    from pyproj import Transformer
    tr = Transformer.from_crs('EPSG:4326', 'EPSG:26910', always_xy=True)
    xs, ys = zip(*[tr.transform(x, y) for x, y in [(W, S), (E, S), (W, N), (E, N)]])
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    res = 2.0
    meta = {'crs': 'EPSG:26910', 'bbox_utm': [x0, y0, x1, y1], 'res': res, 'tiles': []}
    # ImageServer max size is ~4000 px; fetch in tiles of 2000 px (4 km)
    tile = 2000 * res
    ty = y0; r = 0
    while ty < y1:
        tx = x0; c = 0
        while tx < x1:
            bx1, by1 = min(tx + tile, x1), min(ty + tile, y1)
            w, h = round((bx1 - tx) / res), round((by1 - ty) / res)
            params = {'bbox': f'{tx},{ty},{bx1},{by1}', 'bboxSR': 26910, 'imageSR': 26910, 'size': f'{w},{h}',
                      'format': 'tiff', 'pixelType': 'F32', 'noData': -9999, 'interpolation': 'RSP_BilinearInterpolation',
                      'compression': 'LZ77', 'f': 'image'}
            url = 'https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer/exportImage?' + urllib.parse.urlencode(params)
            b = get(url, timeout=600)
            if b[:2] not in (b'II', b'MM'): raise RuntimeError('not a tiff: ' + b[:200].decode('latin1'))
            fn = f'dem_r{r}_c{c}.tif'
            open(os.path.join(OUT, fn), 'wb').write(b)
            meta['tiles'].append({'file': fn, 'bbox': [tx, ty, bx1, by1], 'size': [w, h]})
            log('  dem tile', fn, w, h, len(b))
            tx += tile; c += 1
        ty += tile; r += 1
    json.dump(meta, open(os.path.join(OUT, 'dem_meta.json'), 'w'), indent=1)

@step('dem_3dep_cog_fallback')
def dem_cog():
    # 1/3 arc-second (10 m) 3DEP tile, cropped from the cloud-optimized GeoTIFF with GDAL
    src = '/vsicurl/https://prd-tnm.s3.amazonaws.com/StagedProducts/Elevation/13/TIFF/current/n48w123/USGS_13_n48w123.tif'
    dst = os.path.join(OUT, 'dem10m_aoi.tif')
    subprocess.run(['gdal_translate', '-projwin', str(W), str(N), str(E), str(S), '-co', 'COMPRESS=DEFLATE', '-co', 'PREDICTOR=3', src, dst], check=True)
    log('  dem10m bytes', os.path.getsize(dst))

@step('overture_buildings')
def overture():
    dst = os.path.join(OUT, 'overture_buildings.geojson')
    subprocess.run(['overturemaps', 'download', f'--bbox={W},{S},{E},{N}', '-f', 'geojson', '--type=building', '-o', dst], check=True, timeout=1800)
    n = sum(1 for _ in open(dst))
    log('  overture bytes', os.path.getsize(dst), 'lines', n)
    with open(dst, 'rb') as f, gzip.open(dst + '.gz', 'wb', compresslevel=9) as g:
        g.write(f.read())
    os.remove(dst)

@step('naip_imagery')
def naip():
    # USDA NAIP aerial imagery (public domain) for the core area at 1 m, as JPEG tiles, UTM 10N
    from pyproj import Transformer
    tr = Transformer.from_crs('EPSG:4326', 'EPSG:26910', always_xy=True)
    cS, cW, cN, cE = 47.022, -122.930, 47.066, -122.870
    xs, ys = zip(*[tr.transform(x, y) for x, y in [(cW, cS), (cE, cS), (cW, cN), (cE, cN)]])
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    res = 1.0; tile = 2048 * res; meta = {'crs': 'EPSG:26910', 'res': res, 'tiles': []}
    ty = y0; r = 0
    while ty < y1:
        tx = x0; c = 0
        while tx < x1:
            bx1, by1 = min(tx + tile, x1), min(ty + tile, y1)
            w, h = round((bx1 - tx) / res), round((by1 - ty) / res)
            params = {'bbox': f'{tx},{ty},{bx1},{by1}', 'bboxSR': 26910, 'imageSR': 26910, 'size': f'{w},{h}',
                      'format': 'jpg', 'compressionQuality': 85, 'f': 'image'}
            ok = False
            for base in ['https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPImagery/ImageServer/exportImage',
                         'https://gis.apfo.usda.gov/arcgis/rest/services/NAIP/USDA_CONUS_PRIME/ImageServer/exportImage']:
                try:
                    b = get(base + '?' + urllib.parse.urlencode(params), timeout=600, tries=2)
                    if b[:2] != b'\xff\xd8': raise RuntimeError('not jpeg: ' + b[:200].decode('latin1'))
                    ok = True; break
                except Exception as e:
                    log('  naip source failed', base[:60], repr(e)[:200])
            if not ok: raise RuntimeError('naip failed')
            fn = f'naip_r{r}_c{c}.jpg'
            open(os.path.join(OUT, fn), 'wb').write(b)
            meta['tiles'].append({'file': fn, 'bbox': [tx, ty, bx1, by1], 'size': [w, h]})
            log('  naip tile', fn, w, h, len(b))
            tx += tile; c += 1
        ty += tile; r += 1
    json.dump(meta, open(os.path.join(OUT, 'naip_meta.json'), 'w'), indent=1)

@step('naip_full_2m')
def naip_full():
    from pyproj import Transformer
    tr = Transformer.from_crs('EPSG:4326', 'EPSG:26910', always_xy=True)
    xs, ys = zip(*[tr.transform(x, y) for x, y in [(W, S), (E, S), (W, N), (E, N)]])
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    res = 2.0; tile = 2048 * res; meta = {'crs': 'EPSG:26910', 'res': res, 'tiles': []}
    ty = y0; r = 0
    while ty < y1:
        tx = x0; c = 0
        while tx < x1:
            bx1, by1 = min(tx + tile, x1), min(ty + tile, y1)
            w, h = round((bx1 - tx) / res), round((by1 - ty) / res)
            params = {'bbox': f'{tx},{ty},{bx1},{by1}', 'bboxSR': 26910, 'imageSR': 26910, 'size': f'{w},{h}', 'format': 'jpg', 'compressionQuality': 88, 'f': 'image'}
            b = get('https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPImagery/ImageServer/exportImage?' + urllib.parse.urlencode(params), timeout=600)
            if b[:2] != b'\xff\xd8': raise RuntimeError('not jpeg')
            fn = f'naip2m_r{r}_c{c}.jpg'; open(os.path.join(OUT, fn), 'wb').write(b)
            meta['tiles'].append({'file': fn, 'bbox': [tx, ty, bx1, by1], 'size': [w, h]}); log('  naip2m', fn, w, h, len(b))
            tx += tile; c += 1
        ty += tile; r += 1
    json.dump(meta, open(os.path.join(OUT, 'naip2m_meta.json'), 'w'), indent=1)

if __name__ == '__main__':
    which = sys.argv[1:] or ['osm', 'dem', 'dem_cog', 'overture', 'naip']
    for w in which:
        globals()[w]()
    log('done')
