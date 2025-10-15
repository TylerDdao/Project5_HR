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
    
    void SaveToFile(const string& data, const string& filename) override;
    string LoadFromFile(const string& filename) override;
    bool FileExists(const string& filename) override;
    
    vector<string> ReadLines(const string& filename);
    void WriteLines(const vector<string>& lines, const string& filename);
};

#endif // FILE_REPOSITORY_H

