'use client';
import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import {
  Button,
  Input,
  makeStyles,
  shorthands,
  tokens,
  mergeClasses,
} from '@fluentui/react-components';
import { useRouter } from 'next/navigation';
import {
  DeleteRegular,
  DismissRegular,
  SignOutRegular,
} from '@fluentui/react-icons';

import { useSession, signOut } from 'next-auth/react';

import { fetchChats, createChat, deleteChat, updateChatTitle, fetchUserProfile } from './side-bar.action';
import stylesModule from './side-bar.module.css';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="5" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <path d="M16.5 16.5L20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.6729 3.91287C16.8918 2.69392 18.8682 2.69392 20.0871 3.91287C21.3061 5.13182 21.3061 7.10813 20.0871 8.32708L14.1499 14.2643C13.3849 15.0293 12.3925 15.5255 11.3215 15.6785L9.14142 15.9899C8.82983 16.0344 8.51546 15.9297 8.29289 15.7071C8.07033 15.4845 7.96554 15.1701 8.01005 14.8586L8.32149 12.6785C8.47449 11.6075 8.97072 10.615 9.7357 9.85006L15.6729 3.91287ZM18.6729 5.32708C18.235 4.88918 17.525 4.88918 17.0871 5.32708L11.1499 11.2643C10.6909 11.7233 10.3932 12.3187 10.3014 12.9613L10.1785 13.8215L11.0386 13.6986C11.6812 13.6068 12.2767 13.3091 12.7357 12.8501L18.6729 6.91287C19.1108 6.47497 19.1108 5.76499 18.6729 5.32708ZM11 3.99929C11.0004 4.55157 10.5531 4.99963 10.0008 5.00007C9.00227 5.00084 8.29769 5.00827 7.74651 5.06064C7.20685 5.11191 6.88488 5.20117 6.63803 5.32695C6.07354 5.61457 5.6146 6.07351 5.32698 6.63799C5.19279 6.90135 5.10062 7.24904 5.05118 7.8542C5.00078 8.47105 5 9.26336 5 10.4V13.6C5 14.7366 5.00078 15.5289 5.05118 16.1457C5.10062 16.7509 5.19279 17.0986 5.32698 17.3619C5.6146 17.9264 6.07354 18.3854 6.63803 18.673C6.90138 18.8072 7.24907 18.8993 7.85424 18.9488C8.47108 18.9992 9.26339 19 10.4 19H13.6C14.7366 19 15.5289 18.9992 16.1458 18.9488C16.7509 18.8993 17.0986 18.8072 17.362 18.673C17.9265 18.3854 18.3854 17.9264 18.673 17.3619C18.7988 17.1151 18.8881 16.7931 18.9393 16.2535C18.9917 15.7023 18.9991 14.9977 18.9999 13.9992C19.0003 13.4469 19.4484 12.9995 20.0007 13C20.553 13.0004 21.0003 13.4485 20.9999 14.0007C20.9991 14.9789 20.9932 15.7808 20.9304 16.4426C20.8664 17.116 20.7385 17.7136 20.455 18.2699C19.9757 19.2107 19.2108 19.9756 18.27 20.455C17.6777 20.7568 17.0375 20.8826 16.3086 20.9421C15.6008 21 14.7266 21 13.6428 21H10.3572C9.27339 21 8.39925 21 7.69138 20.9421C6.96253 20.8826 6.32234 20.7568 5.73005 20.455C4.78924 19.9756 4.02433 19.2107 3.54497 18.2699C3.24318 17.6776 3.11737 17.0374 3.05782 16.3086C2.99998 15.6007 2.99999 14.7266 3 13.6428V10.3572C2.99999 9.27337 2.99998 8.39922 3.05782 7.69134C3.11737 6.96249 3.24318 6.3223 3.54497 5.73001C4.02433 4.7892 4.78924 4.0243 5.73005 3.54493C6.28633 3.26149 6.88399 3.13358 7.55735 3.06961C8.21919 3.00673 9.02103 3.00083 9.99922 3.00007C10.5515 2.99964 10.9996 3.447 11 3.99929Z" />
  </svg>
);

const NewChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor" />
    <path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.14 12.94a7.002 7.002 0 0 0 0-1.88l2.03-1.58a.5.5 0 0 0 .12-.66l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a6.99 6.99 0 0 0-1.7-.99l-.36-2.54A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.5.41l-.36 2.54c-.6.25-1.18.58-1.7.99l-2.39-.96a.5.5 0 0 0-.6.22L1.78 8.87a.5.5 0 0 0 .12.65L3.93 11.1a7.02 7.02 0 0 0 0 1.88L1.9 14.56a.5.5 0 0 0-.12.66l1.92 3.32c.15.26.45.34.7.22l2.39-.96c.52.41 1.09.74 1.7.99l.36 2.54c.05.27.28.48.5.48h4c.22 0 .45-.21.5-.48l.36-2.54c.6-.25 1.18-.58 1.7-.99l2.39.96c.25.12.55.04.7-.22l1.92-3.32a.5.5 0 0 0-.12-.66l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z" fill="currentColor" />
  </svg>
);

const OpenIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2" fill="none" />
    <path d="M10 8l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2" fill="none" />
    <path d="M14 8l-4 4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const useStyles = makeStyles({
  asideContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    transitionProperty: 'width, min-width',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    position: 'relative',
    flexShrink: 0,
  },
  sidebarOpen: {
    minWidth: '260px',
    width: '260px',
  },
  sidebarClosed: {
    minWidth: '72px',
    width: '72px',
    ...shorthands.padding('0px', tokens.spacingHorizontalNone),
    overflowX: 'hidden',
  },
  sideContent: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    width: '100%',
  },
  topControls: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
    paddingRight: tokens.spacingHorizontalS,
    paddingLeft: tokens.spacingHorizontalNone,
    flexShrink: 0,
    minHeight: '60px',
    width: '100%',
    boxSizing: 'border-box',
  },
  topControlsOpen: {
    justifyContent: 'space-between',
  },
  topControlsClosed: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingVerticalM,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalXXS),
  },
  rightControlsGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
  chatList: {
    flexGrow: 1,
    overflowY: 'auto',
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalXS),
  },
});

function truncate(text, maxLength) {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}

const closedChatButtonStyle = {
  width: '56px',
  minWidth: '56px',
  maxWidth: '56px',
  padding: '0',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '52px',
};

const Sidebar = forwardRef(({ onChatSelect, currentChatId }, ref) => {
  const styles = useStyles();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [chats, setChats] = useState([]);
  const [editingChatId, setEditingChatId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const editInputRef = useRef(null);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const profileRef = useRef(null);
  const settingsPanelRef = useRef(null);
  const asideRef = useRef(null);
  const gearRef = useRef(null);
  const [settingsStyle, setSettingsStyle] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const displayedChats =
    searchQuery.length > 0
      ? chats.filter(chat => chat.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : chats;

  let rawName = userProfile?.name || session?.user?.name || session?.user?.username || session?.user?.email || 'Aluno';
  const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(rawName);
  
  if (isUUID) {
    rawName = 'Aluno';
  } else if (rawName.includes('@')) {
    rawName = rawName.split('@')[0];
  }
  
  const userName = rawName;
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    if (status !== 'loading') {
      const checkMobile = () => window.innerWidth < 768;
      if (checkMobile()) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    }
  }, [status]);

  useEffect(() => {
    const checkMobile = () => window.innerWidth < 768;
    const handleResize = () => {
      setIsMobile(checkMobile());
    };
    setIsMobile(checkMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      const loadData = async () => {
        try {
          const [chatsData, profileData] = await Promise.all([
            fetchChats(session.user.id),
            fetchUserProfile()
          ]);
          setChats(chatsData || []);
          if (profileData) setUserProfile(profileData);
        } catch (error) {
          console.error('Error fetching data:', error);
          setChats([]);
        }
      };
      loadData();
    } else if (status === 'unauthenticated') {
      setChats([]);
      setUserProfile(null);
    }
  }, [status, session]);

  const handleUpdateTitleCallback = useCallback(async () => {
    if (editingChatId && status === 'authenticated' && session?.user?.id) {
      try {
        const titleToSave = newTitle.trim() || 'Chat sem título';
        await updateChatTitle(editingChatId, session.user.id, titleToSave);
        setChats(prev =>
          prev.map(c => (c.id === editingChatId ? { ...c, title: titleToSave } : c))
        );
      } catch (error) {
        alert('Error updating title: ' + error.message);
      } finally {
        setEditingChatId(null);
        setNewTitle('');
      }
    } else if (editingChatId) {
      setEditingChatId(null);
      setNewTitle('');
    }
  }, [editingChatId, newTitle, session, status]);

  useEffect(() => {
    const handleClickOutside = event => {
      if (editInputRef.current && !editInputRef.current.contains(event.target)) {
        handleUpdateTitleCallback();
      }
    };
    if (editingChatId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editingChatId, handleUpdateTitleCallback]);

  useEffect(() => {
    const handleClickOutsideProfile = event => {
      const clickedInsideProfile = profileRef.current && profileRef.current.contains(event.target);
      const clickedInsidePanel = settingsPanelRef.current && settingsPanelRef.current.contains(event.target);
      if (!clickedInsideProfile && !clickedInsidePanel) {
        setShowSettingsPanel(false);
      }
    };
    if (showSettingsPanel) document.addEventListener('mousedown', handleClickOutsideProfile);
    return () => document.removeEventListener('mousedown', handleClickOutsideProfile);
  }, [showSettingsPanel]);

  useEffect(() => {
    if (!showSettingsPanel) return;
    // when sidebar is open we use the default absolute positioning (CSS)
    if (sidebarOpen) {
      setSettingsStyle({ right: 16, position: 'absolute', bottom: '64px' });
      return;
    }
    // when closed, compute a fixed position next to the sidebar so it is visible
    const asideEl = asideRef.current;
    const profileEl = profileRef.current;
    if (!asideEl || !profileEl) {
      setSettingsStyle({ position: 'fixed', left: 'calc(var(--sidebar-closed-width) + 8px)', top: '80px', right: 'auto', bottom: 'auto', minWidth: '160px' });
      return;
    }
    const asideRect = asideEl.getBoundingClientRect();
    const profileRect = profileEl.getBoundingClientRect();
    const left = Math.round(asideRect.right + 8);
    // position near the profile top
    const top = Math.max(8, Math.round(profileRect.top - 8));
    setSettingsStyle({ position: 'fixed', left: `${left}px`, top: `${top}px`, right: 'auto', bottom: 'auto', minWidth: '160px' });
  }, [showSettingsPanel, sidebarOpen]);

  const handleNewChat = async () => {
    if (status !== 'authenticated' || !session?.user?.id) return;
    try {
      const newChat = await createChat(session.user.id, 'Novo Chat');
      setChats(prev => [newChat, ...prev]);
      if (onChatSelect) onChatSelect(newChat.id);
      try { router.push(`/chat/${newChat.id}`); } catch (e) {}
      if (isMobile && sidebarOpen) setSidebarOpen(false);
    } catch (error) {
      alert('Failed to create new chat: ' + error.message);
    }
  };

  const handleNewChatFirstMessage = async initialTitle => {
    if (status !== 'authenticated' || !session?.user?.id) return null;
    try {
      const titleToUse = initialTitle ? initialTitle : 'Novo Chat';
      const newChat = await createChat(session.user.id, titleToUse);
      setChats(prev => [newChat, ...prev]);
      return newChat.id;
    } catch (error) {
      return null;
    }
  };

  const reloadChats = async (chatIdToUpdate, message) => {
    if (status === 'authenticated' && session?.user?.id) {
      try {
        const truncatedMessage = truncate(message, 25);
        await updateChatTitle(chatIdToUpdate, session.user.id, truncatedMessage);
        const data = await fetchChats(session.user.id);
        setChats(data || []);
      } catch (error) {
        console.error('Error reloading/updating chats:', error);
      }
    }
  };

  useImperativeHandle(ref, () => ({
    handleNewChatFirstMessage,
    reloadChats,
  }));

  const handleChatClick = chatId => {
    if (editingChatId === chatId) return;
    if (onChatSelect) onChatSelect(chatId);
    try { router.push(`/chat/${chatId}`); } catch (e) {}
    if (isMobile && sidebarOpen) setSidebarOpen(false);
  };

  const handleDeleteChat = async chatId => {
    if (status !== 'authenticated' || !session?.user?.id) return;
    try {
      if (chatId === currentChatId && onChatSelect) onChatSelect(null);
      await deleteChat(chatId, session.user.id);
      setChats(prev => prev.filter(chat => chat.id !== chatId));
    } catch (error) {
      alert('Error deleting chat: ' + error.message);
    }
  };

  const handleEditClick = (chat, event) => {
    event.stopPropagation();
    setEditingChatId(chat.id);
    setNewTitle(chat.title);
    setTimeout(() => {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }, 0);
  };

  const handleTitleEditKeyPress = event => {
    if (event.key === 'Enter') handleUpdateTitleCallback();
    else if (event.key === 'Escape') {
      setEditingChatId(null);
      setNewTitle('');
    }
  };

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    if (!newState) {
      setIsSearchActive(false);
      setSearchQuery('');
    }
  };

  if (status === 'loading') {
    return <aside className={mergeClasses(styles.asideContainer, sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed, stylesModule.asideContainer)}></aside>;
  }

  return (
    <>
      {isMobile && !sidebarOpen && (
        <Button
          icon={<OpenIcon />}
          className={stylesModule.mobileToggleButton}
          onClick={toggleSidebar}
          appearance="primary"
        />
      )}

      <aside ref={asideRef} className={mergeClasses(styles.asideContainer, sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed, stylesModule.asideContainer)}>
        
        {/* LOGO SUPERIOR DA SIDEBAR */}
        {sidebarOpen ? (
          <div className={stylesModule.sidebarLogoContainer}>
            <div className={stylesModule.logoWrapper}>
              <div className={stylesModule.logoLeft}>
                <img src="/images/IFSPLOGO.png" alt="IFSP PEP Logo" className={stylesModule.sidebarLogo} style={{ width: '50px' }} />
                <span className={stylesModule.logoText}>IFSP-PEP</span>
              </div>
              <div className={stylesModule.logoRight}>
                <Button
                  size="small"
                  appearance="transparent"
                  icon={<CloseIcon />}
                  onClick={toggleSidebar}
                  className={stylesModule.topControlIcon}
                  aria-label="Fechar barra lateral"
                />
              </div>
            </div>
          </div>
        ) : (
          !isMobile && (
            <div
              className={stylesModule.sidebarLogoContainerClosed}
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
              onClick={toggleSidebar}
              style={{ cursor: 'pointer' }}
              role="button"
              aria-label="Abrir barra lateral"
            >
              {isLogoHovered ? (
                <div className={stylesModule.closedLogoHoverIcon}>
                  <OpenIcon />
                </div>
              ) : (
                <img src="/images/IFSPLOGO.png" alt="IFSP Logo" className={stylesModule.sidebarLogoClosed} />
              )}
            </div>
          )
        )}

        {/* MENU: Nova conversa / Pesquisar (empilhados) */}
        {sidebarOpen && (
          <div className={stylesModule.menuList}>
            <button className={stylesModule.menuItem} onClick={handleNewChat} aria-label="Nova conversa">
              <span className={stylesModule.menuIcon}><NewChatIcon /></span>
              <span className={stylesModule.menuText}>Nova conversa</span>
            </button>
            <button className={stylesModule.menuItem} onClick={() => { setIsSearchActive(true); setSearchQuery(''); }} aria-label="Pesquisar conversas">
              <span className={stylesModule.menuIcon}><SearchIcon /></span>
              <span className={stylesModule.menuText}>Pesquisar conversas</span>
            </button>
          </div>
        )}

        <div className={styles.sideContent}>
          <div className={mergeClasses(styles.topControls, sidebarOpen ? styles.topControlsOpen : styles.topControlsClosed)}>
            {sidebarOpen ? (
              isSearchActive ? (
                <div style={{ display: 'flex', width: '100%', padding: '0 10px' }}>
                  <Input
                    type="text"
                    placeholder="Buscar chats..."
                    value={searchQuery}
                    onChange={(_, data) => setSearchQuery(data.value)}
                    contentAfter={
                      <Button
                        appearance="transparent"
                        icon={<DismissRegular />}
                        onClick={() => { setIsSearchActive(false); setSearchQuery(''); }}
                        className={stylesModule.topControlIcon}
                      />
                    }
                    style={{ width: '100%', backgroundColor: '#2A2B32', color: 'white', border: 'none' }}
                    autoFocus
                  />
                </div>
              ) : (
                <div />
              )
            ) : (
              !isMobile && (
                <>
                  <Button appearance="transparent" icon={<NewChatIcon />} onClick={() => handleNewChat()} size="small" className={stylesModule.topControlIcon} />
                </>
              )
            )}
          </div>

          {sidebarOpen && <div className={stylesModule.recentHeader}>Recentes</div>}
          <div className={styles.chatList} style={!sidebarOpen ? { paddingLeft: 0, paddingRight: 0 } : undefined}>
            {displayedChats.map((chat, index) => (
              <Button
                key={chat.id}
                appearance="subtle"
                className={mergeClasses(stylesModule.chatItemButton, chat.id === currentChatId && stylesModule.chatItemSelected)}
                style={!sidebarOpen ? closedChatButtonStyle : undefined}
                onClick={() => handleChatClick(chat.id)}
              >
                {!sidebarOpen ? (
                  <div className={stylesModule.chatNumber}>{index + 1}</div>
                ) : editingChatId === chat.id ? (
                  <Input
                    ref={editInputRef}
                    value={newTitle}
                    onChange={(_, data) => setNewTitle(data.value)}
                    onBlur={handleUpdateTitleCallback}
                    onKeyDown={handleTitleEditKeyPress}
                    maxLength={30}
                    className={stylesModule.editInput}
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  <div className={stylesModule.chatItemContent}>
                    <span className={stylesModule.chatTitle}>{truncate(chat.title, 20)}</span>
                    <div className={stylesModule.chatItemIcons}>
                      <Button appearance="transparent" size="small" icon={<EditIcon />} onClick={e => handleEditClick(chat, e)} className={stylesModule.iconButtonEdit} />
                      <Button appearance="transparent" size="small" icon={<DeleteRegular />} onClick={e => { e.stopPropagation(); handleDeleteChat(chat.id); }} className={stylesModule.iconButtonDelete} />
                    </div>
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>

        <div ref={profileRef} className={sidebarOpen ? stylesModule.profileSection : stylesModule.profileSectionClosed}>
          {sidebarOpen ? (
            <>
              <div className={stylesModule.profileLeft}>
                <div className={stylesModule.avatar}>{userInitial}</div>
                {sidebarOpen && <span className={stylesModule.userName}>{userName}</span>}
              </div>
              <div className={stylesModule.profileRight}>
                <div ref={gearRef}>
                  <Button
                    appearance="transparent"
                    icon={<SettingsIcon />}
                    onClick={() => setShowSettingsPanel(prev => !prev)}
                    className={stylesModule.gearButton}
                    aria-label="Configurações"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={stylesModule.profileMain}>
                <div className={stylesModule.avatar}>{userInitial}</div>
              </div>
              <div className={stylesModule.profileActions} ref={gearRef}>
                <Button
                  appearance="transparent"
                  icon={<SettingsIcon />}
                  onClick={() => setShowSettingsPanel(prev => !prev)}
                  className={stylesModule.gearButton}
                  aria-label="Configurações"
                />
              </div>
            </>
          )}

          {showSettingsPanel && (
            <div
              ref={settingsPanelRef}
              className={stylesModule.settingsPanel}
              role="dialog"
              aria-label="Configurações do usuário"
              style={sidebarOpen ? { right: 16 } : settingsStyle}
            >
              <button className={stylesModule.settingsItem} onClick={() => { setShowSettingsPanel(false); /* open settings page or modal here if needed */ }}>
                Configurações
              </button>
              <button className={stylesModule.settingsItem} onClick={() => signOut({ callbackUrl: '/login' })}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <SignOutRegular /> Sair
                </span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = 'Sidebar';
export default Sidebar;