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
    int GetConversationId() const;
    vector<int> GetParticipants() const;
    vector<Message> GetMessages() const;
    string GetConversationType() const;
    string GetCreatedAt() const;
    
    // Message management
    void AddMessage(const Message& msg);
    Message* FindMessageById(int msgId);
    int GetMessageCount() const;
    
    // Participant management
    void AddParticipant(int participantId);
    bool HasParticipant(int participantId) const;
    
    // Serialization
    string SerializeHeader() const;
    string SerializeMessages() const;
};

#endif // CONVERSATION_H

