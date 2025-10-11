#pragma once

#ifndef MESSAGE_H
#define MESSAGE_H

#include <string>

using namespace std;

class Message {
private:
    int id;
    int senderId;
    string body;
    string sentAt;
    bool isRead;

public:
    Message();
    Message(int msgId, int sender, const string& content, const string& timestamp);
    
    // Setters
    bool setId(int msgId);
    bool setSenderId(int sender);
    bool setBody(const string& content);
    bool setTime(const string& timestamp);
    
    // Getters
    int getId() const;
    int getSenderId() const;
    string getBody() const;
    string getTime() const;
    bool getIsRead() const;
    
    // Mark message as read
    bool markRead();
    
    // Serialization
    string serialize() const;
    static Message deserialize(const string& data);
};

#endif // MESSAGE_H

