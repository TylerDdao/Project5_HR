#pragma once

#ifndef DATETIME_HELPER_H
#define DATETIME_HELPER_H

#include <string>
#include <ctime>

using namespace std;

class DateTimeHelper {
public:
    static string getCurrentDateTime();
    static string formatDateTime(time_t timestamp);
    static time_t parseDateTime(const string& dateTimeStr);
};

#endif // DATETIME_HELPER_H

