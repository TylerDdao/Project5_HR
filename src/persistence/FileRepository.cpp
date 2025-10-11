#include "../../include/persistence/FileRepository.h"
#include <fstream>
#include <sstream>
#include <iostream>

using namespace std;

FileRepository::FileRepository() {}

void FileRepository::saveToFile(const string& data, const string& filename) {
    ofstream file(filename);
    if (!file) {
        cerr << "Error: Cannot open file " << filename << " for writing.\n";
        return;
    }
    file << data;
    file.close();
}

string FileRepository::loadFromFile(const string& filename) {
    ifstream file(filename);
    if (!file) {
        return "";
    }
    
    stringstream buffer;
    buffer << file.rdbuf();
    file.close();
    
    return buffer.str();
}

bool FileRepository::fileExists(const string& filename) {
    ifstream file(filename);
    return file.good();
}

vector<string> FileRepository::readLines(const string& filename) {
    vector<string> lines;
    ifstream file(filename);
    
    if (!file) {
        return lines;
    }
    
    string line;
    while (getline(file, line)) {
        if (!line.empty()) {
            lines.push_back(line);
        }
    }
    
    file.close();
    return lines;
}

void FileRepository::writeLines(const vector<string>& lines, const string& filename) {
    ofstream file(filename);
    if (!file) {
        cerr << "Error: Cannot open file " << filename << " for writing.\n";
        return;
    }
    
    for (const auto& line : lines) {
        file << line << "\n";
    }
    
    file.close();
}

