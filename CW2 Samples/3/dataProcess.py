import pandas as pd
import json
female = pd.read_csv("series-110319.csv", skiprows=[0, 1,2,3,4,5,6,7],nrows=48, header=None)
male = pd.read_csv("series-110319-2.csv", skiprows=[0, 1,2,3,4,5,6,7],nrows=48, header=None)
df = pd.DataFrame()
df['year'] = female[0]
df['female'] = female[1]
df['male'] = male[1]
employ = []
for i in range(df.shape[0]):
    employ.append({
        'year':int(df['year'][i]),
        'female':float(df['female'][i]),
        'male':float(df['male'][i])
    })
with open('employ.json','w') as f:
    json.dump(employ, f)
