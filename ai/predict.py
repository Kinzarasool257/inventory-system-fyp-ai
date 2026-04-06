import sys
import json
from engine import get_prediction

store = sys.argv[1]
item = sys.argv[2]
stock = int(sys.argv[3])
price = float(sys.argv[4])

result = get_prediction(store, item, stock, price)

print(json.dumps(result))
