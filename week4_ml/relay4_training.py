import pandas as pd
import matplotlib.pyplot as plt
import warnings
import sklearn.exceptions
from sklearn import tree
from sklearn.metrics import precision_recall_fscore_support
from sklearn.metrics import roc_curve, auc
from sklearn.multiclass import OneVsRestClassifier
from sklearn.preprocessing import label_binarize
import pickle


# Ignores the UndefinedMetric for the calculation of precision, as there can be
# a case where the new feature doesn't fit with the set of hyper-parameters.
# Still, as the precision score will be 0 when this happens, it doesn't affect the
# result of the process, because if precision score of certain part is 0, then it will
# immediately affect the overall score, decreasing the whole score.
warnings.filterwarnings("ignore", category=sklearn.exceptions.UndefinedMetricWarning)

#
# STEP1. Loading
# Load the 'Avila' data set 
# (as there is no data to use, used verified and normalized dataset.)
# One MUST download the data set and place 'avila-tr.txt' and 'avila-ts.txt' files
# in the current directory, where this python file will be executed
# to reproduce the results.
# https://archive.ics.uci.edu/ml/datasets/Avila

training_set = pd.read_csv('./avila-tr.txt',
                           names=["aggression", "kindness",
                                  "patience", "sociality", "distiontion",
                                  "obedience", "faithfulness",
                                  "truthfulness", "introvert-ness",
                                  "dependability",
                                  "class"])

test_set = pd.read_csv('./avila-ts.txt',
                           names=["aggression", "kindness",
                                  "patience", "sociality", "distiontion",
                                  "obedience", "faithfulness",
                                  "truthfulness", "introvert-ness",
                                  "dependability",
                                  "class"])
#
# STEP2. Feature matrix
# Make features matrices and target vectors for the training and test sets

# training - features matrix
X_tr = training_set.drop('class', axis=1)
# training -  target vector
y_tr = training_set['class']
# test - features matrix
X_ts = test_set.drop('class', axis=1)
# test - target vector
y_ts = test_set['class']


#
# STEP3. Saving the trained model
# Reproduce the result with pre-set hyper-parameters

model = tree.DecisionTreeClassifier(criterion='gini', max_depth=None,
                                    min_samples_split=2, min_samples_leaf=1, splitter='best')
model.fit(X_tr, y_tr)
y_model = model.predict(X_ts)
org_score = precision_recall_fscore_support(y_ts, y_model, average='macro')
print("Original:      ", "precision:", org_score[0], "recall:", org_score[1], "f-1:", org_score[2])
print()
filename = 'finalized_model.sav'
pickle.dump(model, open(filename, 'wb'))
print('pickle file saved as' + filename)
