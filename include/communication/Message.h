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
    bool SetId(int msgId);
    bool SetSenderId(int sender);
    bool SetBody(const string& content);
    bool SetTime(const string& timestamp);
    
    // Getters
    int GetId() const;
    int GetSenderId() const;
    string GetBody() const;
    string GetTime() const;
    bool GetIsRead() const;
    
    // Mark message as read
    bool MarkRead();
    
    // Serialization
    string Serialize() const;
    static Message Deserialize(const string& data);
};

#endif // MESSAGE_H

