#include <iostream>
#include "test.h"
#include "employeeinfo.h"

using namespace std;
int add(int x, int y) {
	return y + x;
}

int main() {
	//cout << add(2, 6) << endl;

	EmployeeInfoManagement manage;
	manage.loadFromFile();
	manage.management();
	manage.saveToFile();
	return 0;
}
