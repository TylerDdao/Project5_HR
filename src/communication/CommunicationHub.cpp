#include "../../include/communication/CommunicationHub.h"
#include "../../include/utils/DateTimeHelper.h"
#include "../../include/utils/InputValidator.h"
#include <iostream>
#include <sstream>
#include <algorithm>

using namespace std;

CommunicationHub::CommunicationHub() 
    : conversations(), repository(new FileRepository()), 
      nextConvId(1), nextMsgId(1), dataFilePath("data/conversations.txt") {}

CommunicationHub::CommunicationHub(FileRepository* repo)
    : conversations(), repository(repo), 
      nextConvId(1), nextMsgId(1), dataFilePath("data/conversations.txt") {}

CommunicationHub::~CommunicationHub() {
    if (repository) {
        delete repository;
    }
}

int CommunicationHub::StartConversation(const vector<int>& participantIds, const string& type) {
    if (participantIds.empty()) {
        cout << "Error: Cannot create conversation without participants.\n";
        return -1;
    }
    
    if (type == ONE_TO_ONE && participantIds.size() != 2) {
        cout << "Error: One-to-one conversation requires exactly 2 participants.\n";
        return -1;
    }
    
    Conversation conv(nextConvId, participantIds, type);
    conversations.push_back(conv);
    
    int convId = nextConvId;
    nextConvId++;
    
    cout << "Conversation " << convId << " started successfully.\n";
    SaveToFile();
    
    return convId;
}

int CommunicationHub::SendMessage(int convId, int senderId, const string& body) {
    Conversation* conv = findConversationById(convId);
    
    if (!conv) {
        cout << "Error: Conversation " << convId << " not found.\n";
        return -1;
    }
    
    if (!conv->HasParticipant(senderId)) {
        cout << "Error: Sender " << senderId << " is not a participant in this conversation.\n";
        return -1;
    }
    
    string timestamp = DateTimeHelper::GetCurrentDateTime();
    Message msg(nextMsgId, senderId, body, timestamp);
    
    conv->AddMessage(msg);
    
    int msgId = nextMsgId;
    nextMsgId++;
    
    cout << "Message sent successfully. Message ID: " << msgId << "\n";
    SaveToFile();
    
    return msgId;
}

vector<Message> CommunicationHub::ListMessages(int convId) {
    Conversation* conv = findConversationById(convId);
    
    if (!conv) {
        cout << "Error: Conversation " << convId << " not found.\n";
        return vector<Message>();
    }
    
    return conv->GetMessages();
}

void CommunicationHub::DisplayConversation(int convId) {
    Conversation* conv = findConversationById(convId);
    
    if (!conv) {
        cout << "Error: Conversation " << convId << " not found.\n";
        return;
    }
    
    cout << "\n==== Conversation " << convId << " (" << conv->GetConversationType() << ") ====\n";
    cout << "Participants: ";
    vector<int> participants = conv->GetParticipants();
    for (size_t i = 0; i < participants.size(); ++i) {
        cout << participants[i];
        if (i < participants.size() - 1) cout << ", ";
    }
    cout << "\nCreated: " << conv->GetCreatedAt() << "\n";
    cout << "Messages: " << conv->GetMessageCount() << "\n\n";
    
    vector<Message> messages = conv->GetMessages();
    if (messages.empty()) {
        cout << "No messages in this conversation.\n";
        return;
    }
    
    for (const auto& msg : messages) {
        cout << "[" << msg.GetTime() << "] ";
        cout << "Employee " << msg.GetSenderId() << ": ";
        cout << msg.GetBody();
        if (msg.GetIsRead()) {
            cout << " (Read)";
        }
        cout << "\n";
    }
}

void CommunicationHub::DisplayAllConversations() {
    cout << "\n==== All Conversations ====\n";
    if (conversations.empty()) {
        cout << "No conversations found.\n";
        return;
    }
    
    for (const auto& conv : conversations) {
        cout << "Conversation " << conv.GetConversationId() 
             << " (" << conv.GetConversationType() << ") - "
             << conv.GetMessageCount() << " messages\n";
        cout << "  Participants: ";
        vector<int> participants = conv.GetParticipants();
        for (size_t i = 0; i < participants.size(); ++i) {
            cout << participants[i];
            if (i < participants.size() - 1) cout << ", ";
        }
        cout << "\n";
    }
}

Conversation* CommunicationHub::GetConversation(int convId) {
    return findConversationById(convId);
}

vector<Conversation> CommunicationHub::GetConversationsByParticipant(int participantId) {
    vector<Conversation> result;
    
    for (auto& conv : conversations) {
        if (conv.HasParticipant(participantId)) {
            result.push_back(conv);
        }
    }
    
    return result;
}

Conversation* CommunicationHub::findConversationById(int convId) {
    for (auto& conv : conversations) {
        if (conv.GetConversationId() == convId) {
            return &conv;
        }
    }
    return nullptr;
}

void CommunicationHub::generateIds() {
    nextConvId = 1;
    nextMsgId = 1;
    
    for (const auto& conv : conversations) {
        if (conv.GetConversationId() >= nextConvId) {
            nextConvId = conv.GetConversationId() + 1;
        }
        
        for (const auto& msg : conv.GetMessages()) {
            if (msg.GetId() >= nextMsgId) {
                nextMsgId = msg.GetId() + 1;
            }
        }
    }
}

void CommunicationHub::SaveToFile() {
    if (!repository) {
        cerr << "Error: Repository not initialized.\n";
        return;
    }
    
    stringstream ss;
    
    for (const auto& conv : conversations) {
        ss << conv.SerializeHeader() << "\n";
        ss << conv.SerializeMessages();
    }
    
    repository->SaveToFile(ss.str(), dataFilePath);
}

void CommunicationHub::LoadFromFile() {
    if (!repository) {
        cerr << "Error: Repository not initialized.\n";
        return;
    }
    
    if (!repository->FileExists(dataFilePath)) {
        cout << "No existing conversation data found.\n";
        return;
    }
    
    conversations.clear();
    vector<string> lines = repository->ReadLines(dataFilePath);
    
    Conversation* currentConv = nullptr;
    
    for (const auto& line : lines) {
        if (line.substr(0, 5) == "CONV|") {
            stringstream ss(line.substr(5));
            string convIdStr, type, createdAt, participantsStr;
            
            getline(ss, convIdStr, '|');
            getline(ss, type, '|');
            getline(ss, createdAt, '|');
            getline(ss, participantsStr, '|');
            
            vector<int> participants;
            stringstream pss(participantsStr);
            string pId;
            while (getline(pss, pId, ',')) {
                if (!pId.empty()) {
                    participants.push_back(stoi(pId));
                }
            }
            
            Conversation conv(stoi(convIdStr), participants, type);
            conversations.push_back(conv);
            currentConv = &conversations.back();
        }
        else if (line.substr(0, 4) == "MSG|" && currentConv) {
            stringstream ss(line.substr(4));
            string convIdStr, msgData;
            
            getline(ss, convIdStr, '|');
            getline(ss, msgData);
            
            Message msg = Message::Deserialize(msgData);
            currentConv->AddMessage(msg);
        }
    }
    
    generateIds();
    cout << "Loaded " << conversations.size() << " conversations from file.\n";
}

