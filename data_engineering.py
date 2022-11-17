import pandas as pd
import numpy as np

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
    #df.to_csv("ProjectData/champions_league_events_with_names.csv")

    df2 = df[df["eventName"].str.contains("Pass") == True]
    df2.reset_index()  
         
                
    # for index in df.iterrows():
    #     if(df)
def edit_columns(data1):
    df = pd.read_csv(data1)
    positions = df['positions']
    

    start_x = []
    start_y = []
    end_x = []
    end_y = []

    for val in positions:
        start_y.append(list(eval(val))[0]['y'])
        start_x.append(list(eval(val))[0]['x'])
        end_y.append(list(eval(val))[-1]['y'])
        end_x.append(list(eval(val))[-1]['x'])

    #for val in res:
    df['start_y'] = start_y
    df['start_x'] = start_x
    df['end_y'] = end_y
    df['end_x'] = end_x

    df.to_csv("ProjectData/champions_league_events_with_names2.csv")

def add_index(data1):
    df = pd.read_csv(data1)
    print(df)

add_index("ProjectData/champions_league_events_with_names2.csv")
#edit_columns("ProjectData/champions_league_events_with_names.csv")

#combine_rows("events_data.csv", "ProjectData/players.csv")
