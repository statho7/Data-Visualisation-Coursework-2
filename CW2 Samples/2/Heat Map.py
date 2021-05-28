
# coding: utf-8

# In[ ]:


import pandas as pd
import numpy as np
import scipy.stats as stats
import seaborn as sb
import matplotlib.pyplot as plt

final = pd.read_csv("/Users/theloniuspunk/Desktop/Murder Project/murderfinal.csv")
final
counties = list(set(final.county))
counties.sort()
counties
numbers = [x for x in range(1, 59)]
new = dict(zip(counties, numbers))
new
final['gkillings_per_100thousand'] = (final.gang_killings/final['pop'])*100000
final

new = final[(final['pop'] > 50000) & (final.murder_per_100_thousand > 6.2) & (final.years >2001)]
new.county.value_counts()

relevant_counties =['Kern', 'Alameda', 'Tulare', 'Fresno', 'San Joaquin', 'Monterey', 'Los Angeles', 'Merced', 'San Francisco', 'Stanislaus', 'Lake', 'San Bernardino', 'Sacramento', 'Mendocino', 'Solano']
heat_df = final.set_index('county')
heat = heat_df.loc[relevant_counties, :]
heat.reset_index(inplace=True)
heat_df_counties = list(set(heat.county))
heat_df_counties.sort()
relevant_counties.sort()

print(heat_df_counties == relevant_counties)
counties = ["Kern", "Alameda", "Tulare", "Fresno", "San Joaquin", "Monterey", "Los Angeles", "Merced", "San Francisco", "Stanislaus", "Lake", "San Bernardino", "Sacramento", "Mendocino", "Solano"]
value = [x for x in range(1, len(counties)+1)]
value
county_map = dict(zip(counties, value))
heat['county_code'] = heat.county.map(county_map)
heat.to_csv("/Users/theloniuspunk/Desktop/Murder Project/heatmap.csv", index=False)

