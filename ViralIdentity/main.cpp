//Generate Fake Identities
#include <iostream>
#include <fstream>
#include <time.h>
#include <stdlib.h>

using namespace std;

bool CheckFile(char[]);
int randPick(int); //Gen rand from 0 to n-1

int main(){
    cout << "\tWelcome to ViralIdentity. Be Anon." << endl;

    ifstream init("./.init");
    if(init.is_open()){
        cout << endl << "We trust that you have read README.txt. That's all, enjoy ViralIdentity V0.1.0" << endl;
        init.close();
        remove("./.init");
    }

    char fnames[2][50] = {"./Lists/first-names.txt", "./Lists/middle-names.txt"};
    char mails[9][30] = {"gmail.com", "protonmail.com", "outlook.com", "yahoo.com", "zoho.com", "aim.com", "gmx.com", "icloud.com", "yandex.com"};

    if(!(CheckFile(fnames[0]) && CheckFile(fnames[1]))){
        cout << "Name lists not found!" << endl;
        return -1;
    }

    ifstream fn(fnames[0]), ln(fnames[1]);

    char content[20];
    int fn_cnt = 0, ln_cnt = 0;

    while(fn.getline(content, 20)){
        fn_cnt++;
    }

    fn.clear();
    fn.seekg(0);

    while(ln.getline(content, 20)){
        ln_cnt++;
    }

    ln.clear();
    ln.seekg(0);

    cout << endl << "[%] Creating Identity, Hang On [%]" << endl << endl; // to be removed in future

    int randVar = randPick(fn_cnt);
    int cnt = 0;

    string fname, lname;

    while(fn.getline(content, 20)){
        if(cnt == randVar){
            fname = content;
        }
        cnt++;
    }

    randVar = randPick(ln_cnt);
    cnt = 0;

    while(ln.getline(content, 20)){
        if(cnt == randVar){
            lname = content;
        }
        cnt++;
    }

    randVar = randPick(9);

    cout << "Name: " << fname << " " << lname << endl;
    cout << "Email: " << lname[0] << "." << fname << "@" << mails[randVar] << endl;

    fn.close();
    ln.close();

    return 0;
}

bool CheckFile(char Name[]){
    ifstream fil(Name);

    if(fil){
        fil.close();
        return true;
    }

    return false;
}

int randPick(int n){
    srand(time(0));

    return (rand() % n);
}
