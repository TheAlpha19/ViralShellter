#include <iostream>
#include <fstream>

using namespace std;

int main(int argc, char *argv[]){
    cout << "[+] Active Directory Username Generator [+]" << endl;

    if(argc != 3){
        cout << "Usage: " << argv[0] << " <UserNameList.txt> <Output.txt>" << endl;
        return -1;
    }

    fstream u_list, o_list;
    
    u_list.open((string)argv[1], ios::in);
    o_list.open((string)argv[2], ios::out);

    char names[200], fname[100], lname[100];
    int i = 0, toggle = 0, k = 0;

    cout << "Generating Wordlist..." << endl;

    while(!u_list.eof()){
        u_list.getline(names, 200);
        for(i = 0; names[i] != '\0'; i++){
            if(names[i] == ' '){
                toggle = 1;
                continue;
            }

            if(toggle){
                lname[k] = names[i];
                k++;
            }else{
                fname[i] = names[i];
            }
        }
        k = 0;
        toggle = 0;

        o_list << fname << lname << endl; 
        o_list << fname << '.' << lname << endl;
        o_list << fname[0] << lname << endl;
        o_list << fname[0] << '.' << lname << endl;
        o_list << fname << lname[0] << endl;
        o_list << fname << '.' << lname[0] << endl;    

        fill_n(fname, 100, 0);
        fill_n(lname, 100, 0);
    }

    cout << "All Done Here!" << endl;

    u_list.close();
    o_list.close();

    return 0;
}