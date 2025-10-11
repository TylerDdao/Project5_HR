#pragma once

#ifndef COMMUNICATION_HUB_H
#define COMMUNICATION_HUB_H

#include "Conversation.h"
#include "Message.h"
#include "../persistence/FileRepository.h"
#include <vector>
#include <string>

using namespace std;

class CommunicationHub {
private:
    vector<Conversation> conversations;
    FileRepository* repository;
    int nextConvId;
    int nextMsgId;
    string dataFilePath;
    
    Conversation* findConversationById(int convId);
    void generateIds();

public:
    CommunicationHub();
    CommunicationHub(FileRepository* repo);
    ~CommunicationHub();
    
    // Core methods from the design
    int startConversation(const vector<int>& participantIds, const string& type);
    int sendMessage(int convId, int senderId, const string& body);
    vector<Message> listMessages(int convId);
    
    // Additional management methods
    void displayConversation(int convId);
    void displayAllConversations();
    Conversation* getConversation(int convId);
    vector<Conversation> getConversationsByParticipant(int participantId);
    
    // Persistence
    void saveToFile();
    void loadFromFile();
    
    // Conversation management UI
    void manageCommunication(int currentUserId);
};

#endif // COMMUNICATION_HUB_H

