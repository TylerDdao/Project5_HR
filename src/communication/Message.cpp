#include "../../include/communication/Message.h"
#include "../../include/utils/DateTimeHelper.h"
#include <sstream>

using namespace std;

Message::Message() : id(0), senderId(0), body(""), sentAt(""), isRead(false) {}

Message::Message(int msgId, int sender, const string& content, const string& timestamp)
    : id(msgId), senderId(sender), body(content), sentAt(timestamp), isRead(false) {}

bool Message::SetId(int msgId) {
    id = msgId;
    return true;
}

bool Message::SetSenderId(int sender) {
    senderId = sender;
    return true;
}

bool Message::SetBody(const string& content) {
    body = content;
    return true;
}

bool Message::SetTime(const string& timestamp) {
    sentAt = timestamp;
    return true;
}

int Message::GetId() const {
    return id;
}

int Message::GetSenderId() const {
    return senderId;
}

string Message::GetBody() const {
    return body;
}

string Message::GetTime() const {
    return sentAt;
}

bool Message::GetIsRead() const {
    return isRead;
}

bool Message::MarkRead() {
    isRead = true;
    return true;
}

string Message::Serialize() const {
    stringstream ss;
    ss << id << "|" << senderId << "|" << body << "|" << sentAt << "|" << (isRead ? "1" : "0");
    return ss.str();
}

Message Message::Deserialize(const string& data) {
    stringstream ss(data);
    string idStr, senderStr, body, sentAt, readStr;
    
    getline(ss, idStr, '|');
    getline(ss, senderStr, '|');
    getline(ss, body, '|');
    getline(ss, sentAt, '|');
    getline(ss, readStr, '|');
    
    Message msg(stoi(idStr), stoi(senderStr), body, sentAt);
    if (readStr == "1") {
        msg.MarkRead();
    }
    
    return msg;
}

