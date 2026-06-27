import json

with open('/tmp/exec.json', 'r') as f:
    try:
        data = json.load(f)
    except Exception as e:
        print("Error reading json:", e)
        exit(1)

while isinstance(data, list):
    data = data[0]

while isinstance(data, str):
    try:
        data = json.loads(data)
    except:
        break

results = data.get('resultData', {}).get('runData', {})

print("=== Split Keywords ===")
split_node = results.get('Split Keywords', [])
if split_node:
    try:
        split_data = split_node[0]['data']['main'][0][0]
        items = [item['json'] for item in split_data]
        print(json.dumps(items, indent=2, ensure_ascii=False))
    except Exception as e:
        print("Error parsing Split Keywords", e)
else:
    print("No Split Keywords data found")
    
print("\n=== Google Ads API ===")
ads_node = results.get('Google Ads API', [])
print(f"{len(ads_node)} vezes")

print("\n=== Filtro SEO ===")
filtro_node = results.get('Filtro SEO', [])
for exe in filtro_node:
    try:
        out_true = exe['data']['main'][0]
        out_false = exe['data']['main'][1]
        
        if out_true and len(out_true) > 0:
            status = "true"
            item = out_true[0]['json']
        elif out_false and len(out_false) > 0:
            status = "false"
            item = out_false[0]['json']
        else:
            status = "unknown"
            item = {}
            
        input_json = {
            "volume": item.get('volume'),
            "queda_pct": item.get('queda_pct'),
            "sazonalidade": item.get('sazonalidade'),
            "competition": item.get('competition')
        }
        print(f"Output: {status}")
        print("Input JSON:")
        print(json.dumps(input_json, indent=2))
        print("---")
    except Exception as e:
        print("Error parsing Filtro SEO execution", e)
