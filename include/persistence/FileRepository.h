#pragma once

#ifndef FILE_REPOSITORY_H
#define FILE_REPOSITORY_H

#include "IRepository.h"
#include <string>
#include <vector>

using namespace std;

class FileRepository : public IRepository {
public:
    FileRepository();
    
    void saveToFile(const string& data, const string& filename) override;
    string loadFromFile(const string& filename) override;
    bool fileExists(const string& filename) override;
    
    vector<string> readLines(const string& filename);
    void writeLines(const vector<string>& lines, const string& filename);
};

#endif // FILE_REPOSITORY_H

