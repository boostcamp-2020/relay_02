import aiDB
import sys
import pickle
import pandas as pd

# randomly generated inputs
test_set = pd.read_csv('./relay_test.txt',
                    names=["aggression", "kindness",
                           "patience", "sociality", "distiontion",
                           "obedience", "faithfulness",
                           "truthfulness", "introvert-ness",
                           "dependability",
                           "class"])

# file to be loaded
filename = 'finalized_model.sav'
# test - features matrix
X_ts = test_set.drop('class', axis=1)
# test - target vector
y_ts = test_set['class']

loaded_model = pickle.load(open(filename, 'rb'))
# prediction result
result = loaded_model.predict(X_ts)

print(sys.argv[1], result)

