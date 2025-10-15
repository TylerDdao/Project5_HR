//#include "../../include/utils/DateTimeHelper.h"

#include "DateTimeHelper.h"
#include <iomanip>
#include <sstream>

using namespace std;

string DateTimeHelper::GetCurrentDateTime() {
    time_t now = time(nullptr);
    return FormatDateTime(now);
}

string DateTimeHelper::FormatDateTime(time_t timestamp) {
    struct tm timeInfo;
    localtime_s(&timeInfo, &timestamp);
    
    ostringstream oss;
    oss << (timeInfo.tm_year + 1900) << "-"
        << setfill('0') << setw(2) << (timeInfo.tm_mon + 1) << "-"
        << setfill('0') << setw(2) << timeInfo.tm_mday << " "
        << setfill('0') << setw(2) << timeInfo.tm_hour << ":"
        << setfill('0') << setw(2) << timeInfo.tm_min << ":"
        << setfill('0') << setw(2) << timeInfo.tm_sec;
    
    return oss.str();
}

time_t DateTimeHelper::ParseDateTime(const string& dateTimeStr) {
    struct tm timeInfo = {};
    istringstream ss(dateTimeStr);
    
    char delimiter;
    ss >> timeInfo.tm_year >> delimiter
       >> timeInfo.tm_mon >> delimiter
       >> timeInfo.tm_mday
       >> timeInfo.tm_hour >> delimiter
       >> timeInfo.tm_min >> delimiter
       >> timeInfo.tm_sec;
    
    timeInfo.tm_year -= 1900;
    timeInfo.tm_mon -= 1;
    
    return mktime(&timeInfo);
}

