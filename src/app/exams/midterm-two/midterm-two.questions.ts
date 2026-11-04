import { Category } from '../../core/exam.model';

// Original practice clues aligned to the Midterm 2 study guide and prior exam.
// Snippets assume appropriate standard headers and using namespace std.
// Function definitions appear outside main; calls and executable statements appear inside main unless shown otherwise.
// Each clue asks for one response; teaching detail belongs in why.
export const MIDTERM_TWO_CATEGORIES: readonly Category[] = [
  { name: "Function foundations", clues: [
    {"q":"This programming approach divides a program into smaller functions with focused tasks.","a":"Modular programming.","why":"Functions improve readability, reuse, testing, and maintenance."},
    {"q":"In square(6), this is the term for the value 6 passed to the function.","code":"int square(int side) {\n    return side * side;\n}","a":"An argument.","why":"The argument supplies a value to the parameter. return sends the computed value to the caller."},
    {"q":"Give the prototype for displayMenu, a function with no parameters and no return value.","a":"void displayMenu();","why":"A prototype declares the function before use. void means no value is returned; the prototype ends with a semicolon."},
    {"q":"What does announce() display?","code":"void announce() {\n    cout << \"Ready\";\n    return;\n    cout << \"Go\";\n}","a":"Ready","why":"The caller can continue after return. Statements after an executed return in that function are not reached."},
    {"q":"This temporary function implementation stands in for an unfinished function during testing.","a":"A stub.","why":"A stub supplies a temporary implementation, such as a fixed return value. A driver supplies test inputs and checks results."}
  ] },
  { name: "Arguments & scope", clues: [
    {"q":"This symbol makes an int parameter a reference to the caller’s variable.","a":"& (as in int &value).","why":"A reference aliases the original object. A value parameter is a separate copy."},
    {"q":"What does this code display?","code":"void adjust(int a, int &b) {\n    a += 4;\n    b += a;\n}\n// In main:\nint x = 3, y = 5;\nadjust(x, y);\ncout << x << \" \" << y;","a":"3 12","why":"The local copy a becomes 7 while x stays 3. b refers to y, so y becomes 5 + 7."},
    {"q":"What does total(4) return?","code":"int total(int count, int price = 2) {\n    return count * price;\n}","a":"8","why":"Once a parameter has a default argument, subsequent parameters must also have defaults available. Defaults supply omitted trailing arguments."},
    {"q":"What does this code display?","code":"int count = 20;\nvoid visit() {\n    int count = 1;\n    static int visits = 0;\n    cout << count++ << \":\" << ++visits << \" \";\n}\n// In main:\nvisit();\nvisit();\ncout << count;","a":"1:1 1:2 20","why":"The automatic local count is recreated each call and hides the global count. visits has local scope but static lifetime, so it retains its value. The global remains 20."},
    {"q":"Which declaration conflicts with the first declaration?","code":"int twice(int value);\ndouble twice(double value);\ndouble twice(int value);","a":"double twice(int value);","why":"Overloads must differ in their parameter lists. Return type alone does not distinguish calls; twice(3) selects the int parameter and twice(3.0) selects double."}
  ] },
  { name: "Arrays & tables", clues: [
    {"q":"What value is stored in scores[3]?","code":"int scores[4] = {8, 6};","a":"0","why":"An array of size 4 ends at index 3. Remaining elements in a partial aggregate initialization are zero-initialized."},
    {"q":"Give the corrected for-loop header that visits each valid index exactly once.","code":"int readings[3] = {4, 7, 9};\nfor (int i = 1; i <= 3; ++i)\n    cout << readings[i] << \" \";","a":"for (int i = 0; i < 3; ++i)","why":"The original skips index 0 and accesses index 3 outside the array. Built-in array indexing has no bounds checking; invalid access causes undefined behavior."},
    {"q":"What does this code display?","code":"int nums[3] = {2, 5, 8};\nfor (int value : nums)\n    value *= 2;\ncout << nums[1];","a":"5","why":"The first loop modifies copies. Reference loop variables refer directly to each element."},
    {"q":"Parallel arrays names and scores store student records. What index selects the score belonging to names[4]?","a":"4 (scores[4]).","why":"Parallel arrays associate related entries by the same index: names[4] and scores[4] describe the same student."},
    {"q":"Fill in the missing dimension so showTable accepts table.","code":"int table[2][3] = {\n    {2, 4, 6},\n    {8, 10, 12}\n};\nvoid showTable(const int table[][___], int rows);","a":"3","why":"Initialization fills rows in order. The second row has index 1 and the third column has index 2. The column count is needed to locate each row; const prevents element changes through this parameter."}
  ] },
  { name: "Vectors", clues: [
    {"q":"This standard-library container can grow or shrink as elements are added or removed.","a":"vector.","why":"vector manages storage as elements are added or removed."},
    {"q":"What is values.size() after these statements?","code":"vector<int> values(2);\nvalues.push_back(7);\nvalues.push_back(9);","a":"4","why":"The constructor creates two zero-initialized integers. push_back appends new elements rather than filling existing positions."},
    {"q":"This vector member function provides element access with bounds checking.","a":"at().","why":"at() checks the index and throws std::out_of_range when it is outside the vector. Valid indices are less than size()."},
    {"q":"What does nums.size() return after this code?","code":"vector<int> nums = {4, 8};\nnums.push_back(12);\nnums.pop_back();\nnums.at(0) = 5;\nnums.clear();","a":"0","why":"push_back adds 12, pop_back removes it, and at(0) updates the first element. clear removes all elements."},
    {"q":"Fill the blank so removeLast modifies the caller’s vector.","a":"&","why":"The reference avoids modifying a copy. The empty check prevents calling pop_back on an empty vector, which is invalid.","code":"void removeLast(vector<int> ___values) {\n    if (!values.empty())\n        values.pop_back();\n}"}
  ] },
  { name: "Pointers", clues: [
    {"q":"The expression &count produces this information about count.","code":"int count = 11;\nint *ptr = &count;\ncout << *ptr;","a":"Its memory address.","why":"The address-of operator & obtains the address of count. The pointer stores that address, and *ptr accesses the object at that address."},
    {"q":"What is the final value of count?","code":"int count = 6;\nint *ptr = &count;\n*ptr = 14;","a":"14","why":"Assigning through a dereferenced pointer changes the pointed-to object, not the pointer itself."},
    {"q":"Use pointer arithmetic to assign 25 to the fourth element.","code":"int values[5] = {3, 6, 9, 12, 15};","a":"*(values + 3) = 25;","why":"In this expression, the array name converts to a pointer to its first element. Pointer addition moves by elements, and the fourth element has index 3."},
    {"q":"What does this code display?","code":"int nums[4] = {5, 10, 15, 20};\nint *p = nums;\n++p;\n*p += 2;\ncout << nums[1] << \" \" << *(p + 2);","a":"12 20","why":"After ++p, p points to nums[1], which becomes 12. Two elements beyond that position is nums[3], whose value is 20."},
    {"q":"Replace the first parameter declaration so redirect updates the caller’s pointer.","code":"void redirect(int *p, int &target) {\n    p = &target;\n}\n// In main:\nint first = 4, second = 9;\nint *selected = &first;\nredirect(selected, second);","a":"int *&p","why":"A copied pointer can modify a pointed-to object, but assigning a new address to the copy does not update the caller’s pointer. A reference to the pointer allows that update."}
  ] },
  { name: "Dynamic memory", clues: [
    {"q":"This C++ keyword allocates an object in dynamic memory.","a":"new.","why":"new allocates dynamic storage; for example, new int(7) creates an integer initialized to 7. Release that scalar allocation with delete."},
    {"q":"Replace the final statement with the matching deallocation statement.","code":"int *samples = new int[4]{1, 2, 3, 4};\ndelete samples;","a":"delete[] samples;","why":"An array allocation with new[] must be matched with delete[]. Using scalar delete for this array is undefined behavior."},
    {"q":"After delete, p is this kind of pointer: it still holds an address for an object whose lifetime has ended.","code":"int *p = new int(18);\ndelete p;\nif (p != nullptr)\n    cout << *p;","a":"A dangling pointer.","why":"delete does not automatically clear a pointer. A non-null pointer is not proof that the object is still alive; dereferencing released storage is undefined behavior."},
    {"q":"Insert one statement before data = nullptr to prevent the memory leak.","code":"int *data = new int[3]{2, 4, 6};\ndata = nullptr;","a":"delete[] data;","why":"Overwriting the only pointer loses access to the allocation without freeing it. Assigning nullptr alone never releases allocated memory."},
    {"q":"Fill the blank to preserve each existing element while growing the array.","code":"int *larger = new int[size + 1];\nfor (int i = 0; i < size; ++i)\n    larger[i] = ___;\nlarger[size] = value;\ndelete[] data;\ndata = larger;\n++size;","a":"data[i]","why":"Copy data[i] into larger[i] before releasing the old array. This snippet assumes data owns a dynamic array of size elements, size is nonnegative, and allocation succeeds."}
  ] }
];
