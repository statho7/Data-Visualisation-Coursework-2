
# coding: utf-8

# In[289]:


import pandas as pd
import numpy as np

def county_fill(g):
    counties=[]
    county = [counties.append(x) for x in g.county if x not in counties]
    if np.isnan(counties[1]):
        counties.pop(1)
    
    for y in g.county:
        if y in counties:
            g.fillna(y, limit=10, inplace=True)
            
                
pd.options.display.max_rows = None
df = pd.read_csv("/Users/theloniuspunk/Desktop/Murder Project/county_pop_80_90.csv", delimiter="\t")
df

df
df['pop'] = df['pop'].str.replace(",", "")
df['pop'] = df['pop'].apply(pd.to_numeric)
county_fill(df)
df.to_csv("/Users/theloniuspunk/Desktop/Murder Project/county_pop_80_90_final.csv", index=0)

df1 = pd.read_csv("/Users/theloniuspunk/Desktop/Murder Project/county_pop_90_00.csv")
df1['pop'] = df1['pop'].str.replace("\t", "")
df1['pop'] = df1['pop'].apply(pd.to_numeric)
df1['years'] = df1['year']
df1.drop(df1.columns[1], axis=1, inplace=True)
county_fill(df1)
df1[df1.years > 1990].to_csv("/Users/theloniuspunk/Desktop/Murder Project/county_pop_90_00_final.csv", index=0)


df2 = pd.read_csv("/Users/theloniuspunk/Desktop/Murder Project/county_pop_99_2010.csv")
df2.drop(df2.columns[[3,4,5,6]], axis=1, inplace=True)
df2.years = df2.years.astype(str).str.split(".", expand=True)[0]
df2.drop(df2.index[696:714], inplace=True)
df2.years = df2.years.astype(int)
df2['pop'] = df2['pop'].str.replace(",", "")
df2['pop'] = df2['pop'].apply(pd.to_numeric)
df2.dtypes
def county_fill2(g):
    counties=[]
    county = [counties.append(x) for x in g.county if x not in counties]
    if np.isnan(counties[1]):
        counties.pop(1)
    
    for y in g.county:
        if y in counties:
            g.fillna(y, limit=11, inplace=True)
county_fill2(df2)
df2[df2.years > 2000].to_csv("/Users/theloniuspunk/Desktop/Murder Project/county_pop_99_2010_final.csv", index=0)

df3 = pd.read_csv("/Users/theloniuspunk/Desktop/Murder Project/county_pop_2010_17.csv")
df3 = pd.melt(df3, id_vars="county", var_name="year", value_name="pop")
df3['years'] = df3['year'].apply(pd.to_numeric)
df3.drop(df3.columns[1], axis=1, inplace=True)
df3['pop'] =df3['pop'].str.replace(",", "")
df3['pop'] = df3['pop'].astype(int)
df3[df3.years>2010].to_csv("/Users/theloniuspunk/Desktop/Murder Project/county_pop_2010_17_final.csv", index=0)


pop = pd.concat([df, df1[df1.years > 1990], df2[df2.years > 2000], df3[df3.years>2010]], ignore_index=True)
pop.to_csv("/Users/theloniuspunk/Desktop/Murder Project/populations.csv")

murder = pd.read_csv("/Users/theloniuspunk/Desktop/Murder Project/Murder_Numbers.csv")
murder

pop.isnull().sum()
murder.isnull().sum()


pop.dtypes
murder['years'] = murder['year']
murder.drop(murder.columns[6], axis=1, inplace=True)
murder
merged = pd.merge(murder, pop, on=['years', 'county'])
merged.isnull().sum()
merged['unsolved_percentage'] = ((merged['murders'] - merged['solved'])/merged['murders'])*100
merged['youth_percentage'] = (merged['youth_murder']/merged['murders'])*100
merged['murder_per_100_thousand'] = (merged['murders']/merged['pop'])*100000
merged.to_csv("/Users/theloniuspunk/Desktop/Murder Project/merged.csv", index = 0)

youth_pop = pd.read_csv("/Users/theloniuspunk/Desktop/Murder Project/youth_pop.csv")
youth_pop['years'] = youth_pop['year']
youth_pop.drop('year', axis=1, inplace=True)
youth_pop

final = pd.merge(merged, youth_pop, on=['years', 'county'])
final.to_csv("/Users/theloniuspunk/Desktop/Murder Project/final.csv", index=0)
final['youth_murder_per_100k'] = (final['youth_murder']/final['youth_pop'])*100000
counties = list(set(final.county))
final.set_index(['county', 'years'], inplace=True)
years = [x for x in range(1980, 2017)]
#for x in counties:
    #print(x, ":", final.loc[(x, y), 'youth_murder_per_100k'].mean())

#list of dictionaries with youth murder rate over time in California   
ymurder=[]   
for x in years:
    info={}
    info['year'] = '"' + str(x) +'"'
    info['youth_murder_rate'] = (final.loc[(counties, x), 'youth_murder'].sum()/final.loc[(counties, x), 'pop'].sum())*100000
    ymurder.append(info)

yut = pd.DataFrame.from_records(ymurder)
yut.to_csv("/Users/theloniuspunk/Desktop/Murder Project/youth_murder_rates.csv", index=0)

final = final.reset_index()

#final.to_csv("/Users/theloniuspunk/Desktop/Murder Project/CA_murder.csv", index=0)

df = pd.read_csv("/Users/theloniuspunk/Desktop/Murder Project/CA_murder.csv")
df.drop(df.columns[[10,12,13,14]],axis=1, inplace=True)
df['percentage_passion'] = (df.passion_murder/df.murders)*100
df['percentage_other'] = ((df.murders - df.gang_killings - df.passion_murder)/df.murders)*100
df['percentage_passion'].fillna(0, inplace=True)
df['percentage_other'].fillna(0, inplace=True)






    
    
    
    


                     





        
        

