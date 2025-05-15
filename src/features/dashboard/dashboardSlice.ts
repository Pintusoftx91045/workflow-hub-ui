import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  avatar: string;
  status: 'active' | 'inactive';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  department: string;
}

export interface Workflow {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  status: 'draft' | 'qc' | 'qa' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  progress: number;
  assignedTo: string[];
}

export interface Document {
  id: string;
  title: string;
  workflowId: string;
  uploadedBy: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  version: number;
  downloadUrl: string;
}

export interface Comment {
  id: string;
  documentId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

interface DashboardState {
  clients: Client[];
  teamMembers: TeamMember[];
  workflows: Workflow[];
  documents: Document[];
  comments: Comment[];
  isLoading: {
    clients: boolean;
    teamMembers: boolean;
    workflows: boolean;
    documents: boolean;
  };
  error: string | null;
}

const initialState: DashboardState = {
  clients: [
    {
      id: '1',
      name: 'Alpha Corp',
      company: 'Alpha Corporation',
      email: 'contact@alphacorp.com',
      avatar: '/placeholder.svg',
      status: 'active',
    },
    {
      id: '2',
      name: 'Beta Industries',
      company: 'Beta Industries LLC',
      email: 'info@betaindustries.com',
      avatar: '/placeholder.svg',
      status: 'active',
    },
    {
      id: '3',
      name: 'Gamma Tech',
      company: 'Gamma Technologies Inc',
      email: 'support@gammatech.io',
      avatar: '/placeholder.svg',
      status: 'inactive',
    },
  ],
  teamMembers: [
    {
      id: '1',
      name: 'John Doe',
      role: 'draft',
      email: 'john.doe@example.com',
      avatar: '/placeholder.svg',
      department: 'Content',
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: 'qc',
      email: 'jane.smith@example.com',
      avatar: '/placeholder.svg',
      department: 'Quality Control',
    },
    {
      id: '3',
      name: 'Alex Johnson',
      role: 'qa',
      email: 'alex.johnson@example.com',
      avatar: '/placeholder.svg',
      department: 'Quality Assurance',
    },
  ],
  workflows: [
    {
      id: '1',
      title: 'Annual Report Revision',
      clientId: '1',
      clientName: 'Alpha Corp',
      status: 'draft',
      priority: 'high',
      dueDate: '2025-06-15',
      progress: 25,
      assignedTo: ['1'],
    },
    {
      id: '2',
      title: 'Marketing Brochure',
      clientId: '2',
      clientName: 'Beta Industries',
      status: 'qc',
      priority: 'medium',
      dueDate: '2025-06-01',
      progress: 60,
      assignedTo: ['1', '2'],
    },
    {
      id: '3',
      title: 'Product Documentation',
      clientId: '3',
      clientName: 'Gamma Tech',
      status: 'qa',
      priority: 'low',
      dueDate: '2025-05-25',
      progress: 85,
      assignedTo: ['2', '3'],
    },
    {
      id: '4',
      title: 'Technical Specifications',
      clientId: '1',
      clientName: 'Alpha Corp',
      status: 'completed',
      priority: 'medium',
      dueDate: '2025-05-10',
      progress: 100,
      assignedTo: ['1', '3'],
    },
  ],
  documents: [
    {
      id: '1',
      title: 'Annual_Report_v1.pdf',
      workflowId: '1',
      uploadedBy: '1',
      uploadedAt: '2025-05-10T10:30:00Z',
      status: 'pending',
      version: 1,
      downloadUrl: '#',
    },
    {
      id: '2',
      title: 'Marketing_Brochure_v2.pdf',
      workflowId: '2',
      uploadedBy: '1',
      uploadedAt: '2025-05-12T14:45:00Z',
      status: 'pending',
      version: 2,
      downloadUrl: '#',
    },
    {
      id: '3',
      title: 'Product_Documentation_v1.pdf',
      workflowId: '3',
      uploadedBy: '2',
      uploadedAt: '2025-05-08T09:15:00Z',
      status: 'approved',
      version: 1,
      downloadUrl: '#',
    },
  ],
  comments: [
    {
      id: '1',
      documentId: '1',
      userId: '2',
      userName: 'Jane Smith',
      userAvatar: '/placeholder.svg',
      content: 'Please review section 3.2, I think it needs more detail.',
      createdAt: '2025-05-11T11:30:00Z',
    },
    {
      id: '2',
      documentId: '2',
      userId: '3',
      userName: 'Alex Johnson',
      userAvatar: '/placeholder.svg',
      content: 'The formatting looks good, but we should add more product images.',
      createdAt: '2025-05-13T10:15:00Z',
    },
  ],
  isLoading: {
    clients: false,
    teamMembers: false,
    workflows: false,
    documents: false,
  },
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchClientsStart: (state) => {
      state.isLoading.clients = true;
    },
    fetchClientsSuccess: (state, action: PayloadAction<Client[]>) => {
      state.clients = action.payload;
      state.isLoading.clients = false;
    },
    fetchClientsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading.clients = false;
      state.error = action.payload;
    },
    
    fetchTeamMembersStart: (state) => {
      state.isLoading.teamMembers = true;
    },
    fetchTeamMembersSuccess: (state, action: PayloadAction<TeamMember[]>) => {
      state.teamMembers = action.payload;
      state.isLoading.teamMembers = false;
    },
    fetchTeamMembersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading.teamMembers = false;
      state.error = action.payload;
    },
    
    fetchWorkflowsStart: (state) => {
      state.isLoading.workflows = true;
    },
    fetchWorkflowsSuccess: (state, action: PayloadAction<Workflow[]>) => {
      state.workflows = action.payload;
      state.isLoading.workflows = false;
    },
    fetchWorkflowsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading.workflows = false;
      state.error = action.payload;
    },
    
    fetchDocumentsStart: (state) => {
      state.isLoading.documents = true;
    },
    fetchDocumentsSuccess: (state, action: PayloadAction<Document[]>) => {
      state.documents = action.payload;
      state.isLoading.documents = false;
    },
    fetchDocumentsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading.documents = false;
      state.error = action.payload;
    },
    
    addComment: (state, action: PayloadAction<Omit<Comment, 'id'>>) => {
      const newComment = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.comments.push(newComment);
    },
    
    updateWorkflowStatus: (state, action: PayloadAction<{ id: string; status: Workflow['status'] }>) => {
      const { id, status } = action.payload;
      const workflow = state.workflows.find(w => w.id === id);
      if (workflow) {
        workflow.status = status;
        if (status === 'completed') {
          workflow.progress = 100;
        } else if (status === 'qa') {
          workflow.progress = 85;
        } else if (status === 'qc') {
          workflow.progress = 60;
        } else if (status === 'draft') {
          workflow.progress = 25;
        }
      }
    },
    
    updateDocumentStatus: (state, action: PayloadAction<{ id: string; status: Document['status'] }>) => {
      const { id, status } = action.payload;
      const document = state.documents.find(d => d.id === id);
      if (document) {
        document.status = status;
      }
    },
    
    addDocument: (state, action: PayloadAction<Omit<Document, 'id'>>) => {
      const newDocument = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.documents.push(newDocument);
    },
    
    addClient: (state, action: PayloadAction<Omit<Client, 'id' | 'avatar'>>) => {
      const newClient = {
        ...action.payload,
        id: Date.now().toString(),
        avatar: '/placeholder.svg',
        status: action.payload.status || 'active'
      };
      state.clients.push(newClient);
    },
    
    addTeamMember: (state, action: PayloadAction<Omit<TeamMember, 'id' | 'avatar'>>) => {
      const newTeamMember = {
        ...action.payload,
        id: Date.now().toString(),
        avatar: '/placeholder.svg'
      };
      state.teamMembers.push(newTeamMember);
    },
    
    addWorkflow: (state, action: PayloadAction<{
      title: string;
      clientId: string;
      priority: 'low' | 'medium' | 'high';
      dueDate: string;
      assignedTo: string[];
    }>) => {
      const { title, clientId, priority, dueDate, assignedTo } = action.payload;
      const client = state.clients.find(c => c.id === clientId);
      
      if (client) {
        const newWorkflow: Workflow = {
          id: Date.now().toString(),
          title,
          clientId,
          clientName: client.name,
          status: 'draft',
          priority,
          dueDate,
          progress: 25,
          assignedTo
        };
        
        state.workflows.push(newWorkflow);
      }
    },
    
    deleteClient: (state, action: PayloadAction<string>) => {
      state.clients = state.clients.filter(client => client.id !== action.payload);
    },
    
    deleteTeamMember: (state, action: PayloadAction<string>) => {
      state.teamMembers = state.teamMembers.filter(member => member.id !== action.payload);
    },
    
    deleteWorkflow: (state, action: PayloadAction<string>) => {
      state.workflows = state.workflows.filter(workflow => workflow.id !== action.payload);
    },
    
    deleteDocument: (state, action: PayloadAction<string>) => {
      state.documents = state.documents.filter(document => document.id !== action.payload);
    },
    
    deleteComment: (state, action: PayloadAction<string>) => {
      state.comments = state.comments.filter(comment => comment.id !== action.payload);
    }
  },
});

export const {
  fetchClientsStart,
  fetchClientsSuccess,
  fetchClientsFailure,
  fetchTeamMembersStart,
  fetchTeamMembersSuccess,
  fetchTeamMembersFailure,
  fetchWorkflowsStart,
  fetchWorkflowsSuccess,
  fetchWorkflowsFailure,
  fetchDocumentsStart,
  fetchDocumentsSuccess,
  fetchDocumentsFailure,
  addComment,
  updateWorkflowStatus,
  updateDocumentStatus,
  addDocument,
  addClient,
  addTeamMember,
  addWorkflow,
  deleteClient,
  deleteTeamMember,
  deleteWorkflow,
  deleteDocument,
  deleteComment
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
