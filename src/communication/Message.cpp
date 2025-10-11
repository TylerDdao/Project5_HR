#include "../../include/communication/Message.h"
#include "../../include/utils/DateTimeHelper.h"
#include <sstream>

using namespace std;

Message::Message() : id(0), senderId(0), body(""), sentAt(""), isRead(false) {}

Message::Message(int msgId, int sender, const string& content, const string& timestamp)
    : id(msgId), senderId(sender), body(content), sentAt(timestamp), isRead(false) {}

bool Message::setId(int msgId) {
    id = msgId;
    return true;
}

bool Message::setSenderId(int sender) {
    senderId = sender;
    return true;
}

bool Message::setBody(const string& content) {
    body = content;
    return true;
}

bool Message::setTime(const string& timestamp) {
    sentAt = timestamp;
    return true;
}

int Message::getId() const {
    return id;
}

int Message::getSenderId() const {
    return senderId;
}

string Message::getBody() const {
    return body;
}

string Message::getTime() const {
    return sentAt;
}

bool Message::getIsRead() const {
    return isRead;
}

bool Message::markRead() {
    isRead = true;
    return true;
}

string Message::serialize() const {
    stringstream ss;
    ss << id << "|" << senderId << "|" << body << "|" << sentAt << "|" << (isRead ? "1" : "0");
    return ss.str();
}

Message Message::deserialize(const string& data) {
    stringstream ss(data);
    string idStr, senderStr, body, sentAt, readStr;
    
    getline(ss, idStr, '|');
    getline(ss, senderStr, '|');
    getline(ss, body, '|');
    getline(ss, sentAt, '|');
    getline(ss, readStr, '|');
    
    Message msg(stoi(idStr), stoi(senderStr), body, sentAt);
    if (readStr == "1") {
        msg.markRead();
    }
    
    return msg;
}

