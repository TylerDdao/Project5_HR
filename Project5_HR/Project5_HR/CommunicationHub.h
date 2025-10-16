#pragma once

#ifndef COMMUNICATION_HUB_H
#define COMMUNICATION_HUB_H

#include "Conversation.h"
#include "Message.h"
#include "FileRepository.h"
#include <vector>
#include <string>

using namespace std;

/// @brief This is CommunicationHub Class
class CommunicationHub {
private:
    vector<Conversation> conversations;
    FileRepository* repository;
    int nextConvId;
    int nextMsgId;
    string dataFilePath;

    /// @brief This is a find conversation by id function
    /// @param convId 
    /// @return Conversation*
    Conversation* findConversationById(int convId);

    /// @brief This is a generate ids function
    /// @return void
    void generateIds();

public:
    /// @brief This is a default constructor
    CommunicationHub();

    /// @brief This is a constructor with repository parameter
    /// @param repo 
    CommunicationHub(FileRepository* repo);

    /// @brief This is a destructor
    ~CommunicationHub();

    /// @brief This is a start conversation function
    /// @param participantIds 
    /// @param type 
    /// @return int
    int StartConversation(const vector<int>& participantIds, const string& type);

    /// @brief This is a send message function
    /// @param convId 
    /// @param senderId 
    /// @param body 
    /// @return int
    int SendMessage(int convId, int senderId, const string& body);

    /// @brief This is a list messages function
    /// @param convId 
    /// @return vector<Message>
    vector<Message> ListMessages(int convId);

    /// @brief This is a display conversation function
    /// @param convId 
    /// @return void
    void DisplayConversation(int convId);

    /// @brief This is a display all conversations function
    /// @return void
    void DisplayAllConversations();

    /// @brief This is a get conversation function
    /// @param convId 
    /// @return Conversation*
    Conversation* GetConversation(int convId);

    /// @brief This is a get conversations by participant function
    /// @param participantId 
    /// @return vector<Conversation>
    vector<Conversation> GetConversationsByParticipant(int participantId);

    /// @brief This is a save to file function
    /// @return void
    void SaveToFile();

    /// @brief This is a load from file function
    /// @return void
    void LoadFromFile();

};

#endif // COMMUNICATION_HUB_H