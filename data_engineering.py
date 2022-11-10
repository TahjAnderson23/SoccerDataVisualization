import pandas as pd

def convert_json_to_csv(file_path, new_name):
    df = pd.read_json(file_path)
    df.to_csv(new_name, index = None)
    print(df)

def cut_off_rows(file_path):
    df = pd.read_csv(file_path)
    df = df.loc[df["matchId"] == 1694390]
    print(df)

cut_off_rows("events_data.csv")