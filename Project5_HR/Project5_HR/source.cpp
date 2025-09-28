#include <iostream>
#include "test.h"

using namespace std;
int add(int a, int b) {
	return a + b;
}

int main() {
	cout << add(2, 4) << endl;
}