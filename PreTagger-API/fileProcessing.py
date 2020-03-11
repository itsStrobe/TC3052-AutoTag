import abc
from enum import Enum

class ProjectType(Enum):
    CSV = 1
    TXT = 2

class ProjectInterface(metaclass=abc.ABCMeta):
    @abc.abstractmethod
    def getProjectFiles(self, )
