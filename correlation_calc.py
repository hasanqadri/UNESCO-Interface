from scipy.stats import pearsonr
import pandas as pd
import numpy as np

#indicators = ['Indicator1', 'Indicator2', 'Indicator3', 'Indicator4', 'Population']

dfi = pd.read_csv('indicator_file.csv')
print("Reading SDG file!!")
df_sdg = pd.read_csv('data/SDG/SDG_DATA_NATIONAL.csv')
df_edun = pd.read_csv('data/EDUN/EDUN_DATA_NATIONAL.csv')
df_dem = pd.read_csv('data/DEM/DEM_DATA_NATIONAL.csv')
print("Completed Reading SDG file!!")

indicators = list()
variables = dfi['INDICATOR_ID']
dfc = pd.DataFrame(index=variables)

for var in variables:
    dfc[var] = [1.0]*len(variables)
print(dfc)


def get_tuples(data):
    tuples = set()
    for index, row in data.iterrows():
        tuples.add((row['COUNTRY_ID'],row['YEAR']))
    return tuples


for index, row in dfi.iterrows():
    c_x = []

    if 'SDG' in row['ROOT']:
        df = df_sdg
    elif 'EDUN' in row['ROOT']:
        df = df_edun
    else:
        df = df_dem

    indi_x = row['INDICATOR_ID']
    if indi_x not in indicators:
        indicators.append(indi_x)
    data_x = df.loc[df['INDICATOR_ID'] == indi_x]
    x_tups = get_tuples(data_x)
    print("Filtered data_x")

    for index, row in dfi.iterrows():
        if row['INDICATOR_ID'] not in indicators:

            if 'SDG' in row['ROOT']:
                df_y = df_sdg
            elif 'EDUN' in row['ROOT']:
                df_y = df_edun
            else:
                df_y = df_dem

            indi_y = row['INDICATOR_ID']
            data_y = df_y.loc[df_y['INDICATOR_ID'] == indi_y]
            y_tups = get_tuples(data_y)
            print(y_tups)
            common_tups = list(x_tups.intersection(y_tups))
            c_data_x = data_x[data_x[['COUNTRY_ID', 'YEAR']].apply(tuple, axis=1).isin(common_tups)].sort_values(['COUNTRY_ID', 'YEAR'])['VALUE']
            c_data_y = data_y[data_y[['COUNTRY_ID', 'YEAR']].apply(tuple, axis=1).isin(common_tups)].sort_values(['COUNTRY_ID', 'YEAR'])['VALUE']

            print("Filtered data_y")
            print(c_data_y)
            print(c_data_x)
            corr, _ = pearsonr(c_data_x, c_data_y)
            dfc[indi_y][indi_x] = str(np.round(corr, 3))
            dfc[indi_x][indi_y] = str(np.round(corr, 3))
            #c_x.append(str(np.round(corr, 3)))
            print("Calculated corr for {} and {}".format(indi_x, indi_y))

    #x = c_x.copy()
    #dfc.append(x)

# for indi_x in indicators:
#     c_x = []
#     for indi_y in indicators:
#         corr, _ = pearsonr(df[indi_x], df[indi_y])
#         c_x.append(str(np.round(corr, 3)))
#     x = c_x.copy()
#     dfc.append(x)

print(dfc)
dfc.to_csv('correlation.csv')

# with open('correlation.csv', 'w') as f:
#     headers = ','.join(indicators)
#     headers = 'Variables,'+headers
#     f.write(headers+'\n')
#     i = 0
#     for index, row in dfc.iterrows():
#         #ind = indicators[i]
#         row_str = index + ',' + ','.join(row)
#         f.write(row_str+'\n')
#         i += 1
