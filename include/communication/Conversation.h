#pragma once

#ifndef CONVERSATION_H
#define CONVERSATION_H

#include "Message.h"
#include <string>
#include <vector>

using namespace std;

// Constants for conversation types
const string ONE_TO_ONE = "ONE_TO_ONE";
const string GROUP = "GROUP";

class Conversation {
private:
    int conversationId;
    vector<int> participantIds;
    vector<Message> messages;
    string conversationType;
    string createdAt;

public:
    Conversation();
    Conversation(int convId, const vector<int>& participants, const string& type);
    
    // Getters
    int getConversationId() const;
    vector<int> getParticipants() const;
    vector<Message> getMessages() const;
    string getConversationType() const;
    string getCreatedAt() const;
    
    // Message management
    void addMessage(const Message& msg);
    Message* findMessageById(int msgId);
    int getMessageCount() const;
    
    // Participant management
    void addParticipant(int participantId);
    bool hasParticipant(int participantId) const;
    
    // Serialization
    string serializeHeader() const;
    string serializeMessages() const;
};

#endif // CONVERSATION_H

