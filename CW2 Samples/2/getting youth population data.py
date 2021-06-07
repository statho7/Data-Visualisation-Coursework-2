import pandas as pd
import numpy as np

df = pd.read_csv("/Users/theloniuspunk/Desktop/Murder Project/youth_pop_ca.csv")
# pd.options.display.max_rows = None
# pd.options.display.max_columns = None
df1 = df[(df['year'] >= 1980) & (df['year'] <= 2016)]
df1.head()
df1.tail()
df1 = df1[(df1['age'] >= 10) & (df1['age'] <= 24)]
df1.drop(df1.columns[[0, 4, 5]], axis=1, inplace=True)
df1['county'] = df1['county'].str.lower().str.title()
counties = list(set(df1.county))


def youthpop(years, counties):
    new_df = []
    for x in years:
        for y in counties:
            try:
                info = {}
                info['year'] = x
                info['county'] = y
                info['youth_pop'] = df1.loc[(x, y), 'pop_total'].sum()



            # some counties because there were no homicides aren't included in certain years and throws a KeyError
            except KeyError:
                pass
            else:
                new_df.append(info)

    return new_df


df1.set_index(['year', 'county'], inplace=True)

years = [x for x in range(1980, 2017)]

df1.head(25)
youth = youthpop(years, counties)


youth_pop = pd.DataFrame.from_records(youth)
youth_pop.to_csv("/Users/theloniuspunk/Desktop/Murder Project/youth_pop.csv", index=False)
