import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

df = pd.read_csv("/Users/theloniuspunk/Desktop/Murder Project/California_Murders.csv")
df.columns
df.shape
pd.options.display.max_columns = None
pd.options.display.max_rows = None

#nominal values for murder solved 1 and not solved 0
df["Solved_Nom"] = df.Solved.map({'Yes':1, 'No':0})

#saved the old data set in df1
df1 = df
df.drop(['ID', 'Source', 'ActionType', 'Subcircum', 'VicCount', 'OffCount', 'FileDate'], axis=1, inplace=True)

#makes column names lowercase
df.columns = df.columns.str.lower()

#monterey county data
monterey = df.loc[df.cntyfips == 'Monterey, CA', :]

monterey[monterey.circumstance.isin(['Gambling', 'Juvenile gang killings'])]

#getting rid of comma and CA after each county
df.cntyfips = df.cntyfips.str.replace(', CA', '')

#all the counties in a list
counties = list(set(df.cntyfips))

#gets percentages of types of murders
df.circumstance.value_counts(normalize=True)

#dict of top types of murders
x = dict(monterey.circumstance.value_counts(normalize=True))
sorted(x.items(), key=lambda x: x[1], reverse=True)
pd.crosstab(df.cntyfips, df.circumstance == 'Juvenile gang killings')

#number of murders with children playing with a gun
(df.circumstance == 'Children playing with gun').value_counts()

#creating count variable for number of incidences
df['murder'] = 1

#dropping extraneous variables
df.drop(['state', 'month', 'incident', 'vicrace', 'vicethnic', 'offrace', 'offethnic', 'fstate', 'statename', 'homicide', 'situation', 'solved', 'ori', 'agency', 'agentype'], axis=1, inplace=True)

#figuring out what percentage of passion crimes are solved in CA
df.relationship.value_counts()

#making a list and coding passion murders
passion = ['Friend', 'Wife', 'Girlfriend', 'Son', 'Other family', 'Daughter', 'Neighbor', 'Husband', 'Boyfriend', 'Father', 'In-law', 'Homosexual relationship', 'Common-law wife', 'Common-law husband', 'Ex-wife', 'Stepfather', 'Sister', 'Stepson', 'Stepdaughter', 'Ex-husband', 'Stepmother', 'Employee', 'Employer']

relationships = pd.crosstab(df.relationship, df.solved_nom)
relationships = relationships.reset_index()

relationships['percentage_solved'] = relationships[1]/(relationships[1] + relationships[0])

rel = relationships.loc[relationships.relationship =='Acquaintance', :]
relationships = relationships.loc[:, ['relationship', 'percentage_solved']]

result = []
for index, row in relationships.iterrows():
    if row.relationship in passion:
        result.append(row.percentage_solved)

passion_crimes_solved = sum(result)/len(result)

df.weapon.value_counts(normalize=True)
df[df.cntyfips == 'Amador']

years = [x for x in range(1980, 2017)]
years
df
firearms = ['Handgun - pistol, revolver, etc', 'Firearm, type not stated', 'Shotgun', 'Rifle', 'Other gun']


# df.loc[(1977, 'Alameda'), :].circumstance

def murders(years, counties):
    new_df = []
    for x in years:
        for y in counties:
            try:
                info = {}
                info['year'] = x
                info['county'] = y
                info['murders'] = df.loc[(x, y), 'murder'].sum()
                info['solved'] = df.loc[(x, y), 'solved_nom'].sum()
                count_gang = 0
                for z in df.loc[(x, y), 'circumstance']:
                    if z == 'Juvenile gang killings' or z == 'Gangland killings':
                        count_gang += 1
                    info['gang_killings'] = count_gang

                count_passion = 0
                for v in df.loc[(x, y), 'relationship']:
                    if v in passion:
                        count_passion += 1
                    info['passion_murder'] = count_passion

                count_firearms = 0
                for g in df.loc[(x, y), 'weapon']:
                    if g in firearms:
                        count_firearms += 1
                    info['guns_involved'] = count_firearms


                count_youth = 0
                for youth in df.loc[(x, y), 'vicage']:
                    if youth >=10 and youth <=24:
                        count_youth +=1
                    info['youth_murder'] = count_youth


            # some counties because there were no homicides aren't included in certain years and throws a KeyError
            except KeyError:
                info['year'] = x
                info['county'] = y
                info['murders'] = 0
                info['solved'] = 0
                info['guns_involved'] = 0
                info['gang_killings'] = 0
                info['passion_murder'] = 0
                info['youth_murder'] = 0
            finally:
                new_df.append(info)

    return new_df

df['vicage'] = df['vicage'].str.replace("Newborn or infant", "0")
df['vicage'] = df['vicage'].str.replace("Age unknown", "1001")
df['vicage'] = df['vicage'].str.replace("99 years old or more", '2000')
df['vicage'] = df['vicage'].apply(pd.to_numeric)

# print(df.vicage)


df.set_index(['year', 'cntyfips'], inplace=True)

newdf = murders(years, counties)

df_java = pd.DataFrame.from_records(newdf)
df_java.to_csv("/Users/theloniuspunk/Desktop/Murder Project/Murder_Numbers.csv", index=False)
print(df_java)



