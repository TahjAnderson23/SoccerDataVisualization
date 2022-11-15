import pandas as pd

def convert_json_to_csv(file_path, new_name):
    df = pd.read_json(file_path)
    df.to_csv(new_name, index = None)
    print(df)

def cut_off_rows(file_path):
    df = pd.read_csv(file_path)
    df = df.loc[df["matchId"] == 1694390]
    print(df)

#cut_off_rows("events_data.csv")

def eval_data(file_path):
    df = pd.read_csv(file_path)
    print(df)

def combine_rows(data1, data2):
    df1 = pd.read_csv(data1)
    df2 = pd.read_csv(data2)

    df = pd.merge(df1,df2[['playerId', 'firstName','lastName','role']], on='playerId', how='left')
    #df['clean_roles'] = df['role'].str.replace('code2:', '')
    df['clean_roles'] = df['role'].str[41:-2]
    df['clean_roles'] = df['clean_roles'].replace(' ','')
    df = df.drop(columns=['role'])
    print(df)
    #df.to_csv("ProjectData/champions_league_events_with_names.csv")
    for index, row in df.iterrows():
        if index != 0:
            if df['eventName'] != 'pass' or df[index - 1].eventName != 'pass':
                df.drop(df.index[index])





combine_rows("events_data.csv", "ProjectData/players.csv")
