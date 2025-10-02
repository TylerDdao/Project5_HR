#include <iostream>
#include "test.h"

using namespace std;
int add(int x, int y) {
	return y + x;
}

int minus(int a, int b) {
	return a - b;
}

int main() {
	cout << add(2, 6) << endl;
	return 0;
}