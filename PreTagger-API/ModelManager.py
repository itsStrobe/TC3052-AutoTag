import abc
import string

import Numpy as np
import Pandas as pd
from PreTaggerEnums import ProjectType
from PreTaggerKeywords import DataframeKeywords
from sklearn.feature_extraction.text import TfidVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.preprocessing import LabelEncoder


class ModelInterface(metaclass=abc.ABCMeta):

    ## -- CLASS INDEPENDENT METHODS -- ##

    """ Pre-process the Text by applying common NLP techniques dependent on the model type."""
    @abc.abstractstaticmethod
    def preProcessing(X : pd.DataFrame, dataCol : str)

    ## -- CLASS DEPENDENT METHODS -- ##

    """ Set Model's Vocabulary. This will typically initialize the Vectorizer object. """
    @abc.abstractmethod
    def setVocabulary(self, X : [str])

    """ Set Model's Classes. This ensures that all classes are represented """
    @abc.abstractmethod
    def setClasses(self, y : [str])

    """ Set Model's HyperParameters """
    @abc.abstractmethod
    def setHyperParam(self, hyperParams : {})

    """ Train the Model """
    @abc.abstractmethod
    def train(self, X : pd.DataFrame, y : pd.DataFrame)

    """ Get Predictions """
    @abc.abstractmethod
    def predict(self, X : pd.DataFrame)


class Model(ModelInterface):

    self.clf = None
    self.vectorizer = None

    @staticmethod
    def preProcessing(X : pd.DataFrame, dataCol : str):

        for idx, row in X.iterrows():
            # Remove capitalization
            row[dataCol] = row[dataCol].lower()

            # Remove punctuation
            row[dataCol] = row[dataCol].translate(str.maketrans("", "", string.punctuation))

            # Remove whitespaces
            row[dataCol] = row[dataCol].strip()

        return X


class TextClassificationModel(ModelInterface):

    self.classEncoder = None

    def __init__(self, hyperParams : {}):
        self.clf = MultinomialNB()
        self.vectorizer = TfidVectorizer()
        self.classEncoder = LabelEncoder()

        self.setHyperParam(hyperParams)

    def setVocabulary(self, X : [pd.DataFrame], dataCol : str = DataframeKeywords.DATA_COL):
        X_vec = []

        for text in X:
            X_vec.append(X[dataCol].values)

        self.vectorizer.fit(X_vec)

    def setClasses(self, y : pd.DataFrame, tagCol : str = DataframeKeywords.TAG_COL):
        y_vec = list(y[tagCol].values)

        self.classEncoder.fit(y_vec)

    def setHyperParam(self, hyperParams : {}):
        self.clf.set_params(hyperParams)

    def train(self, X : pd.DataFrame, y : pd.DataFrame, dataCol : str = DataframeKeywords.DATA_COL, tagCol : str = DataframeKeywords.TAG_COL):
        if(self.vectorizer is None):
            self.setVocabulary(X)

        if(self.classEncoder is None):
            self.setClasses(y[DataframeKeywords.TAG_COL].values)

        X_enc = self.vectorizer.transform(X[dataCol].values)
        y_enc = self.classEncoder.transform(y[tagCol].values)

        self.clf.fit(X_enc, y_enc)

    def predict(self, X : pd.DataFrame, dataCol : str = DataframeKeywords.DATA_COL):
        if(self.vectorizer is None or self.classEncoder is None):
            print("Vectorizer or ClassEncoder not initialized.")
            raise TypeError

        X_enc = self.vectorizer.transform(X[dataCol].values)

        y_enc = self.clf.predict(X_enc)

        return list(self.classEncoder.inverse_transform(y_enc))

class ModelFactory:

    @staticmethod
    def createModel(projType : ProjectType, hyperParams : {}):

        if(projType == ProjectType.TEXT_CLASSIFICATION):
            return TextClassificationModel(hyperParams)

        raise NotImplementedError
