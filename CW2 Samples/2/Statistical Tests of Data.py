
# coding: utf-8

# In[31]:


import pandas as pd
import numpy as np
import scipy.stats as stats
import seaborn as sb
import matplotlib.pyplot as plt
final = pd.read_csv("/Users/theloniuspunk/Desktop/Murder Project/murderfinal.csv")

final = final[final.murders > 0]
# looking for more than 0 murders to eliminate any NaN values that might obnubilate the stats tests

gang = final.percentage_gang_killings
final['solved'] = (final.solved/final.murders)*100
final
solved = final.solved
passion = final.percentage_passion

stats.ttest_ind(passion, gang)
# Ttest_indResult(statistic=-34.62898362946912, pvalue=2.738572334182631e-228)
# means we can reject the null hypothesis that there isn't any difference between these two distributions 

plt.hist(gang)
plt.show()
plt.hist(passion)
plt.show()
plt.hist(solved)
# reveals that the data isn't normally distributed so we have to run the shapiro tests

stats.shapiro(gang)
# 0.6020103096961975, 0.0 - normally distributed
stats.shapiro(passion)
# 0.870166003704071, 6.429953740265506e-37 - non-normally distributed


stats.mannwhitneyu(gang, passion)
# MannwhitneyuResult(statistic=655850.0, pvalue=5.326562925503838e-257) - still reject null hypothesis

print("gang: ",stats.pearsonr(gang, solved))
# gang:  (-0.23486429028124303, 5.803166452475776e-25) - shows that there is a statistically significant negative relationship between the variables
print("passion: ", stats.pearsonr(passion, solved))
# passion:  (0.4310289197688286, 7.208013082646228e-86) - shows that there is a statistically significant positive relationship between the variables

# linear regression for gang-related homicides
plt.figure()
plt.scatter(solved, gang)
slope, intercept, r_value, p_value, std_err = stats.linregress(solved, gang)
print(slope)
print(intercept)
predicted_solve = (slope * gang) + intercept
plt.plot(gang, predicted_solve)

#linear regression for passion murderes
plt.figure()
plt.scatter(solved, passion)
slope, intercept, r_value, p_value, std_err = stats.linregress(solved, passion)
predicted_solve = (slope * passion) + intercept
plt.plot(passion, predicted_solve)


#the lines show the similar trends predicted by the pearsonr test

