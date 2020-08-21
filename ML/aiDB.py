import sqlite3

class AI_DB(object):
    def __init__(self, db_file_name):
        self.conn = sqlite3.connect(db_file_name)
        self.cur = self.conn.cursor()
    def read_1_data(self, user_id):
        query = "SELECT * FROM user WHERE user_id="+str(user_id)
        self.cur.execute(query)
        row = self.cur.fetchall()
        return row
    def read_all_data(self):
        query = "SELECT * FROM user"
        self.cur.execute(query)
        rows = self.cur.fetchall()
        return rows
    def updatePersonType(self, user_id, person_type):
        query = "UPDATE user SET person_type = \""+str(person_type)+"\" WHERE user_id = "+str(user_id)
        self.cur.execute(query)
    def __del__(self):
        print("DB class deleted.")
        self.conn.commit()
        self.conn.close()

db = AI_DB("./chat_test.db")
print(db.read_all_data())
print(db.read_1_data(1))
db.updatePersonType(3, "G")
print(db.read_all_data())
del db
#cur.execute("SELECT * FROM user")
#cur.execute("CREATE TABLE IF NOT EXISTS user(user_id integer primary key autoincrement, gender varchar(20), nickname varchar(20), type varchar(1))")
