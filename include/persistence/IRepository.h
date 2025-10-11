#pragma once

#ifndef IREPOSITORY_H
#define IREPOSITORY_H

#include <string>

using namespace std;

class IRepository {
public:
    virtual void saveToFile(const string& data, const string& filename) = 0;
    virtual string loadFromFile(const string& filename) = 0;
    virtual bool fileExists(const string& filename) = 0;
    virtual ~IRepository() = default;
};

#endif // IREPOSITORY_H

