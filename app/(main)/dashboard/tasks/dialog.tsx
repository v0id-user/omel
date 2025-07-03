'use client';

import { useState, useEffect, useCallback } from 'react';
import { DashboardDialog } from '@/components/dashboard';
import { OButton } from '@/components/omel/Button';
import { trpc } from '@/trpc/client';
import toast from 'react-hot-toast';
import {
  Calendar as CalendarIcon,
  AtSignCircle,
  MultiplePagesPlus,
  Community,
  Search,
} from 'iconoir-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar, formatGregorianDateArabic } from '@/components/ui/calendar';
import { Switch } from '@/components/omel/Switch';
import { CreateTaskInput } from '@/database/types/task';
import { useUserInfoStore } from '@/store/persist/userInfo';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/omel/Spinner';
import { Contact } from '@/database/types/contacts';
import { useList, useKey, useToggle } from 'react-use';
import { authClient } from '@/lib/betterauth/auth-client';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrganizationMember {
  id: string;
  name: string;
  email?: string;
}

export function TaskDialog({ isOpen, onClose }: TaskDialogProps) {
  const utils = trpc.useUtils();
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [assignedUser, setAssignedUser] = useState<OrganizationMember | null>(null);
  const [assigneeSearchTerm, setAssigneeSearchTerm] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<Contact | null>(null);
  const [clientSearchTerm, setClientSearchTerm] = useState<string>('');
  const [moreTasks, toggleMoreTasks] = useToggle(false);
  const [tasks, setTasks] = useState<CreateTaskInput[]>([]);
  const [description, setDescription] = useState<string>('');
  const userInfo = useUserInfoStore();
  const {
    data: organization,
    isPending: isOrgPending,
    error: orgError,
  } = authClient.useActiveOrganization();
  const router = useRouter();
  useKey('Escape', () => onClose());

  // Use useList for efficient contact list management
  const [contactList, { set: setContactList, clear: clearContactList }] = useList<Contact>([]);

  // Use useList for efficient assignee list management
  const [assigneeList, { set: setAssigneeList }] = useList<OrganizationMember>([]);

  // Get bulk contacts for initial list
  const {
    data: bulkContacts,
    error: bulkError,
    isPending: isBulkPending,
  } = trpc.crm.dashboard.contact.getBulk.useQuery(
    {
      limit: 50,
    },
    {
      retry: (failureCount, error) => {
        return error?.data?.code !== 'NOT_FOUND' && failureCount < 3;
      },
    }
  );

  // Search clients query
  const {
    data: searchResults,
    error: searchError,
    isPending: isSearchPending,
  } = trpc.crm.dashboard.contact.search.useQuery(
    {
      searchTerm: clientSearchTerm,
      limit: 20,
    },
    {
      enabled: clientSearchTerm.trim().length > 0,
      retry: (failureCount, error) => {
        return error?.data?.code !== 'NOT_FOUND' && failureCount < 3;
      },
    }
  );

  // Function to move selected contact to top and sort
  const moveSelectedToTop = useCallback(
    (contacts: Contact[]) => {
      if (!selectedClient) return contacts;

      const filtered = contacts.filter(contact => contact.id !== selectedClient.id);
      return [selectedClient, ...filtered];
    },
    [selectedClient]
  );

  // Function to filter assignees based on search and move selected to top
  const getFilteredAssignees = useCallback(() => {
    if (!organization?.members) return [];

    // Transform organization members to our OrganizationMember interface
    let members: OrganizationMember[] = organization.members.slice(0, 50).map(member => ({
      id: member.userId,
      name: member.user.name,
      email: member.user.email,
    }));

    // Filter by search term if provided
    if (assigneeSearchTerm.trim().length > 0) {
      const searchLower = assigneeSearchTerm.toLowerCase();
      members = members.filter(
        member =>
          member.name.toLowerCase().includes(searchLower) ||
          (member.email && member.email.toLowerCase().includes(searchLower))
      );
    }

    // Move assigned users to top
    const assignedIds = assignedUser?.id ? [assignedUser.id] : [];
    const assigned = members.filter(member => assignedIds.includes(member.id));
    const unassigned = members.filter(member => !assignedIds.includes(member.id));

    return [...assigned, ...unassigned];
  }, [organization?.members, assigneeSearchTerm, assignedUser]);

  // Update contact list based on search state
  useEffect(() => {
    if (clientSearchTerm.trim().length > 0) {
      // User is searching - use search results
      if (searchResults?.data) {
        const sortedContacts = moveSelectedToTop(searchResults.data);
        setContactList(sortedContacts);
      } else if (searchError?.data?.code === 'NOT_FOUND') {
        clearContactList();
      }
    } else {
      // No search term - use bulk contacts
      if (bulkContacts) {
        const sortedContacts = moveSelectedToTop(bulkContacts);
        setContactList(sortedContacts);
      }
    }
  }, [
    clientSearchTerm,
    searchResults,
    bulkContacts,
    searchError,
    moveSelectedToTop,
    setContactList,
    clearContactList,
  ]);

  // Update assignee list based on organization data and search
  useEffect(() => {
    const filteredAssignees = getFilteredAssignees();
    setAssigneeList(filteredAssignees);
  }, [getFilteredAssignees, setAssigneeList]);

  // Set default assignee to current user when organization data loads
  useEffect(() => {
    if (organization?.members && !assignedUser) {
      const user = userInfo.getUserInfo();
      if (user) {
        const currentUserMember = organization.members.find(
          member => member.userId === user.userId
        );
        if (currentUserMember) {
          setAssignedUser({
            id: currentUserMember.userId,
            name: currentUserMember.user.name,
            email: currentUserMember.user.email,
          });
        }
      }
    }
  }, [organization?.members, assignedUser, userInfo]);

  // Handle errors
  useEffect(() => {
    if (searchError && searchError.data?.code !== 'NOT_FOUND') {
      toast.error(searchError.message);
    }
    if (bulkError && bulkError.data?.code !== 'NOT_FOUND') {
      toast.error(bulkError.message);
    }
    if (orgError) {
      toast.error(orgError.message);
    }
  }, [searchError, bulkError, orgError]);

  const createTask = trpc.crm.dashboard.task.new.useMutation({
    onSuccess: () => {
      toast.success('تم إنشاء المهمة بنجاح');
      onClose();
      utils.invalidate();
      // Reset form
      setDueDate(new Date());
      setAssignedUser(null);
      setSelectedClient(null);
      setDescription('');
      setAssigneeSearchTerm('');
      setClientSearchTerm('');
    },
    onError: err => toast.error(err.message || 'حدث خطأ'),
  });

  const appendTask = (task: CreateTaskInput) => {
    setTasks(prev => [...prev, task]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = userInfo.getUserInfo();

    if (!user) {
      toast.error('حدث خطأ');
      router.push('/clock-in');
      return;
    }

    if (!assignedUser) {
      toast.error('يجب تحديد عضو للمهمة');
      return;
    }

    const task: CreateTaskInput = {
      description,
      dueDate: dueDate || null,
      assignedTo: assignedUser.id,
      status: 'pending',
      category: null,
      priority: 'low',
      relatedTo: selectedClient?.id || null,
    };

    appendTask(task);
    if (!moreTasks) {
      createTask.mutate(tasks);
    }
  };

  const handleAssigneeSelect = (member: OrganizationMember) => {
    setAssignedUser(member === assignedUser ? null : member);
  };

  return (
    <DashboardDialog
      isOpen={isOpen}
      title="مهمة جديدة"
      onClose={onClose}
      icon={<MultiplePagesPlus className="w-4 h-4" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
        {/* Task Body */}
        <textarea
          required
          name="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="اكتب تفاصيل المهمة هنا..."
          className="w-full pt-4 px-4 text-sm font-medium focus:outline-none focus:ring-0 focus:border-primary resize-none min-h-[32px]"
        />

        {/* Bottom Controls & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-2 border-t border-gray-200 bg-gray-300/10">
          {/* Inline Due Date & Assignee */}
          <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
            {/* Due Date */}
            <Popover>
              <PopoverTrigger
                asChild
                className="cursor-pointer py-1.5 px-2.5 rounded-md hover:bg-gray-200 transition-colors"
              >
                <label className="flex items-center gap-2 font-medium">
                  <CalendarIcon className="h-4 w-4" />
                  {dueDate ? formatGregorianDateArabic(dueDate) : 'اليوم'}
                </label>
              </PopoverTrigger>
              <PopoverContent
                className="bg-transparent border-0 p-0 w-fit z-[999]"
                align="end"
                side="bottom"
                sideOffset={7}
                sticky="always"
              >
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date: Date | Date[] | null) => {
                    setDueDate(date as Date | null);
                  }}
                  className="rounded-md border bg-white"
                />
              </PopoverContent>
            </Popover>

            {/* Assignee */}
            <Popover>
              <PopoverTrigger
                asChild
                className="cursor-pointer py-1.5 px-2.5 rounded-md hover:bg-gray-200 transition-colors"
              >
                <label className="flex items-center gap-2 font-medium">
                  <AtSignCircle className="h-4 w-4" />
                  {assignedUser
                    ? (() => {
                        const user = userInfo.getUserInfo();
                        return user && assignedUser.id === user.userId
                          ? 'معينة لك'
                          : assignedUser.name;
                      })()
                    : 'تعيين إلى'}
                </label>
              </PopoverTrigger>
              <PopoverContent
                className="bg-white p-3 w-80 z-[999]"
                align="end"
                side="bottom"
                sideOffset={10}
                avoidCollisions={false}
                sticky="always"
              >
                <div className="space-y-3">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="ابحث عن أعضاء الفريق..."
                      value={assigneeSearchTerm}
                      onChange={e => setAssigneeSearchTerm(e.target.value)}
                      className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      dir="rtl"
                    />
                  </div>

                  {/* Search Results */}
                  <div className="max-h-48 overflow-y-auto">
                    {/* Show spinner when loading organization */}
                    {isOrgPending ? (
                      <div className="flex justify-center py-4">
                        <Spinner size="sm" containerClassName="flex items-center justify-center" />
                      </div>
                    ) : /* Show no results message when no members found */
                    assigneeList.length === 0 ? (
                      assigneeSearchTerm.trim().length > 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                          لم يتم العثور على أعضاء
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">
                          لا توجد أعضاء متاحين
                        </p>
                      )
                    ) : (
                      <div className="space-y-1">
                        {assigneeList.map(member => {
                          const isSelected = assignedUser?.id === member.id;
                          return (
                            <button
                              key={member.id}
                              onClick={() => handleAssigneeSelect(member)}
                              className={`w-full text-right p-2 rounded-md transition-colors focus:outline-none group ${
                                isSelected
                                  ? 'bg-gray-100 hover:bg-gray-200'
                                  : 'hover:bg-gray-100 focus:bg-gray-100'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {member.name}
                                  </div>
                                  {member.email && (
                                    <div className="text-xs text-gray-500 truncate">
                                      {member.email}
                                    </div>
                                  )}
                                </div>
                                {/* Selection indicator with hover preview */}
                                <div
                                  className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-200 ${
                                    isSelected
                                      ? 'bg-black group-hover:bg-gray-700'
                                      : 'bg-gray-400 opacity-0 group-hover:opacity-100'
                                  }`}
                                ></div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Client linked to tasks */}
            <Popover>
              <PopoverTrigger
                asChild
                className="cursor-pointer py-1.5 px-2.5 rounded-md hover:bg-gray-200 transition-colors"
              >
                <label className="flex items-center gap-2 font-medium">
                  <Community className="h-4 w-4" />
                  {selectedClient ? selectedClient.name : 'ربط بعميل'}
                </label>
              </PopoverTrigger>
              <PopoverContent
                className="bg-white p-3 w-80 z-[999]"
                align="end"
                side="bottom"
                sideOffset={10}
                avoidCollisions={false}
                sticky="always"
              >
                <div className="space-y-3">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="ابحث عن عميل..."
                      value={clientSearchTerm}
                      onChange={e => setClientSearchTerm(e.target.value)}
                      className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      dir="rtl"
                    />
                  </div>

                  {/* Search Results */}
                  <div className="max-h-48 overflow-y-auto">
                    {/* Show spinner when searching */}
                    {clientSearchTerm.trim().length > 0 && isSearchPending ? (
                      <div className="flex justify-center py-4">
                        <Spinner size="sm" containerClassName="flex items-center justify-center" />
                      </div>
                    ) : /* Show spinner when loading bulk contacts initially */
                    clientSearchTerm.trim().length === 0 && isBulkPending ? (
                      <div className="flex justify-center py-4">
                        <Spinner size="sm" containerClassName="flex items-center justify-center" />
                      </div>
                    ) : /* Show no results message when search returns empty */
                    contactList.length === 0 ? (
                      clientSearchTerm.trim().length > 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                          لم يتم العثور على عملاء
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">
                          لا توجد عملاء متاحين
                        </p>
                      )
                    ) : (
                      <div className="space-y-1">
                        {contactList.map(contact => {
                          const isSelected = selectedClient?.id === contact.id;
                          return (
                            <button
                              key={contact.id}
                              onClick={() => {
                                setSelectedClient(isSelected ? null : contact);
                                setClientSearchTerm('');
                              }}
                              className={`w-full text-right p-2 rounded-md transition-colors focus:outline-none group ${
                                isSelected
                                  ? 'bg-gray-100 hover:bg-gray-200'
                                  : 'hover:bg-gray-100 focus:bg-gray-100'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {contact.name}
                                  </div>
                                  {contact.email && (
                                    <div className="text-xs text-gray-500 truncate">
                                      {contact.email}
                                    </div>
                                  )}
                                </div>
                                {/* Selection indicator with hover preview */}
                                <div
                                  className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-200 ${
                                    isSelected
                                      ? 'bg-black group-hover:bg-gray-700'
                                      : 'bg-gray-400 opacity-0 group-hover:opacity-100'
                                  }`}
                                ></div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-4">
            {/* Add more */}
            <Switch
              checked={moreTasks}
              onChange={() => toggleMoreTasks()}
              label="اصنع المزيد"
              labelClassName="text-sm text-gray-500 font-medium"
            />

            {/* Cancel Button */}
            <OButton
              variant="ghost"
              type="button"
              onClick={() => onClose()}
              className="flex items-center gap-2 px-2 font-medium text-sm"
            >
              الغاء
              <kbd className="px-2 py-1 text-[11px] font-light text-gray-800 bg-transparent border border-gray-200 rounded-lg min-w-[24px] h-6 flex items-center justify-center">
                Esc
              </kbd>
            </OButton>

            {/* Save Button */}
            <OButton
              variant="secondary"
              type="submit"
              isLoading={createTask.isPending}
              className="flex items-center gap-2 px-4 font-medium text-sm"
            >
              حفظ
              <svg
                className="ring-1 ring-gray-300 rounded-sm p-[2px]"
                width="16"
                height="16"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.50419 7.75419C2.33336 7.92502 2.33336 8.20204 2.50419 8.37289L5.42086 11.2895C5.59169 11.4604 5.8687 11.4604 6.03954 11.2895C6.21037 11.1187 6.21037 10.8417 6.03954 10.6708L3.82913 8.46044H9.33336C10.6219 8.46044 11.6667 7.41577 11.6667 6.12711V2.91878C11.6667 2.67716 11.4708 2.48128 11.2292 2.48128C10.9875 2.48128 10.7917 2.67716 10.7917 2.91878V6.12711C10.7917 6.93498 10.1412 7.58544 9.33336 7.58544H3.82913L6.03954 5.37504C6.21037 5.20421 6.21037 4.9272 6.03954 4.75637C5.8687 4.58553 5.59169 4.58553 5.42086 4.75637L2.50419 7.67303C2.50419 7.67303 2.50419 7.75419 2.50419 7.75419Z"
                  fill="currentColor"
                />
              </svg>
            </OButton>
          </div>
        </div>
      </form>
    </DashboardDialog>
  );
}
