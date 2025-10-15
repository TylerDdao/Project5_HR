#pragma once

#ifndef COMMUNICATION_HUB_H
#define COMMUNICATION_HUB_H

#include "Conversation.h"
#include "Message.h"
#include "FileRepository.h"
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
    int StartConversation(const vector<int>& participantIds, const string& type);
    int SendMessage(int convId, int senderId, const string& body);
    vector<Message> ListMessages(int convId);
    
    // Additional management methods
    void DisplayConversation(int convId);
    void DisplayAllConversations();
    Conversation* GetConversation(int convId);
    vector<Conversation> GetConversationsByParticipant(int participantId);
    
    // Persistence
    void SaveToFile();
    void LoadFromFile();
    
    // Conversation management UI
    void ManageCommunication(int currentUserId);
};

#endif // COMMUNICATION_HUB_H

