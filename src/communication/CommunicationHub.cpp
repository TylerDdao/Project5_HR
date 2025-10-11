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

int CommunicationHub::startConversation(const vector<int>& participantIds, const string& type) {
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
    saveToFile();
    
    return convId;
}

int CommunicationHub::sendMessage(int convId, int senderId, const string& body) {
    Conversation* conv = findConversationById(convId);
    
    if (!conv) {
        cout << "Error: Conversation " << convId << " not found.\n";
        return -1;
    }
    
    if (!conv->hasParticipant(senderId)) {
        cout << "Error: Sender " << senderId << " is not a participant in this conversation.\n";
        return -1;
    }
    
    string timestamp = DateTimeHelper::getCurrentDateTime();
    Message msg(nextMsgId, senderId, body, timestamp);
    
    conv->addMessage(msg);
    
    int msgId = nextMsgId;
    nextMsgId++;
    
    cout << "Message sent successfully. Message ID: " << msgId << "\n";
    saveToFile();
    
    return msgId;
}

vector<Message> CommunicationHub::listMessages(int convId) {
    Conversation* conv = findConversationById(convId);
    
    if (!conv) {
        cout << "Error: Conversation " << convId << " not found.\n";
        return vector<Message>();
    }
    
    return conv->getMessages();
}

void CommunicationHub::displayConversation(int convId) {
    Conversation* conv = findConversationById(convId);
    
    if (!conv) {
        cout << "Error: Conversation " << convId << " not found.\n";
        return;
    }
    
    cout << "\n==== Conversation " << convId << " (" << conv->getConversationType() << ") ====\n";
    cout << "Participants: ";
    vector<int> participants = conv->getParticipants();
    for (size_t i = 0; i < participants.size(); ++i) {
        cout << participants[i];
        if (i < participants.size() - 1) cout << ", ";
    }
    cout << "\nCreated: " << conv->getCreatedAt() << "\n";
    cout << "Messages: " << conv->getMessageCount() << "\n\n";
    
    vector<Message> messages = conv->getMessages();
    if (messages.empty()) {
        cout << "No messages in this conversation.\n";
        return;
    }
    
    for (const auto& msg : messages) {
        cout << "[" << msg.getTime() << "] ";
        cout << "Employee " << msg.getSenderId() << ": ";
        cout << msg.getBody();
        if (msg.getIsRead()) {
            cout << " (Read)";
        }
        cout << "\n";
    }
}

void CommunicationHub::displayAllConversations() {
    cout << "\n==== All Conversations ====\n";
    if (conversations.empty()) {
        cout << "No conversations found.\n";
        return;
    }
    
    for (const auto& conv : conversations) {
        cout << "Conversation " << conv.getConversationId() 
             << " (" << conv.getConversationType() << ") - "
             << conv.getMessageCount() << " messages\n";
        cout << "  Participants: ";
        vector<int> participants = conv.getParticipants();
        for (size_t i = 0; i < participants.size(); ++i) {
            cout << participants[i];
            if (i < participants.size() - 1) cout << ", ";
        }
        cout << "\n";
    }
}

Conversation* CommunicationHub::getConversation(int convId) {
    return findConversationById(convId);
}

vector<Conversation> CommunicationHub::getConversationsByParticipant(int participantId) {
    vector<Conversation> result;
    
    for (auto& conv : conversations) {
        if (conv.hasParticipant(participantId)) {
            result.push_back(conv);
        }
    }
    
    return result;
}

Conversation* CommunicationHub::findConversationById(int convId) {
    for (auto& conv : conversations) {
        if (conv.getConversationId() == convId) {
            return &conv;
        }
    }
    return nullptr;
}

void CommunicationHub::generateIds() {
    nextConvId = 1;
    nextMsgId = 1;
    
    for (const auto& conv : conversations) {
        if (conv.getConversationId() >= nextConvId) {
            nextConvId = conv.getConversationId() + 1;
        }
        
        for (const auto& msg : conv.getMessages()) {
            if (msg.getId() >= nextMsgId) {
                nextMsgId = msg.getId() + 1;
            }
        }
    }
}

void CommunicationHub::saveToFile() {
    if (!repository) {
        cerr << "Error: Repository not initialized.\n";
        return;
    }
    
    stringstream ss;
    
    for (const auto& conv : conversations) {
        ss << conv.serializeHeader() << "\n";
        ss << conv.serializeMessages();
    }
    
    repository->saveToFile(ss.str(), dataFilePath);
}

void CommunicationHub::loadFromFile() {
    if (!repository) {
        cerr << "Error: Repository not initialized.\n";
        return;
    }
    
    if (!repository->fileExists(dataFilePath)) {
        cout << "No existing conversation data found.\n";
        return;
    }
    
    conversations.clear();
    vector<string> lines = repository->readLines(dataFilePath);
    
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
            
            Message msg = Message::deserialize(msgData);
            currentConv->addMessage(msg);
        }
    }
    
    generateIds();
    cout << "Loaded " << conversations.size() << " conversations from file.\n";
}

void CommunicationHub::manageCommunication(int currentUserId) {
    int choice;
    
    do {
        cout << "\n==== Communication System ====\n";
        cout << "Current User ID: " << currentUserId << "\n";
        cout << "1. Start One-to-One Conversation\n";
        cout << "2. Start Group Conversation\n";
        cout << "3. View My Conversations\n";
        cout << "4. Send Message\n";
        cout << "5. View Conversation Messages\n";
        cout << "6. View All Conversations\n";
        cout << "0. Back to Main Menu\n";
        
        choice = InputValidator::readInt("Enter your choice: ");
        
        if (choice == 1) {
            int otherUserId = InputValidator::readInt("Enter the other participant's Employee ID: ");
            vector<int> participants = {currentUserId, otherUserId};
            startConversation(participants, ONE_TO_ONE);
        }
        else if (choice == 2) {
            int numParticipants = InputValidator::readInt("How many participants (including yourself)? ");
            vector<int> participants;
            participants.push_back(currentUserId);
            
            for (int i = 1; i < numParticipants; ++i) {
                int participantId = InputValidator::readInt("Enter Employee ID for participant " + to_string(i + 1) + ": ");
                participants.push_back(participantId);
            }
            
            startConversation(participants, GROUP);
        }
        else if (choice == 3) {
            vector<Conversation> myConvs = getConversationsByParticipant(currentUserId);
            
            if (myConvs.empty()) {
                cout << "You have no conversations.\n";
            }
            else {
                cout << "\n==== Your Conversations ====\n";
                for (const auto& conv : myConvs) {
                    cout << "Conversation " << conv.getConversationId()
                         << " (" << conv.getConversationType() << ") - "
                         << conv.getMessageCount() << " messages\n";
                }
            }
        }
        else if (choice == 4) {
            int convId = InputValidator::readInt("Enter Conversation ID: ");
            string messageBody = InputValidator::readString("Enter your message: ");
            sendMessage(convId, currentUserId, messageBody);
        }
        else if (choice == 5) {
            int convId = InputValidator::readInt("Enter Conversation ID: ");
            displayConversation(convId);
        }
        else if (choice == 6) {
            displayAllConversations();
        }
        else if (choice == 0) {
            cout << "Returning to main menu...\n";
        }
        else {
            cout << "Invalid choice. Please try again.\n";
        }
        
    } while (choice != 0);
}

