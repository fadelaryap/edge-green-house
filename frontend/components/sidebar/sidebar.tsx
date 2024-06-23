import React from 'react';
import { Box } from '../styles/box';
import { Sidebar } from './sidebar.styles';
import { Avatar, Tooltip } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { CompaniesDropdown } from './companies-dropdown';
import { HomeIcon } from '../icons/sidebar/home-icon';
import { PaymentsIcon } from '../icons/sidebar/payments-icon';
import { BalanceIcon } from '../icons/sidebar/balance-icon';
import { AccountsIcon } from '../icons/sidebar/accounts-icon';
import { DevIcon } from '../icons/sidebar/dev-icon';
import { SettingsIcon } from '../icons/sidebar/settings-icon';
import { CollapseItems } from './collapse-items';
import { SidebarItem } from './sidebar-item';
import { SidebarMenu } from './sidebar-menu';
import { FilterIcon } from '../icons/sidebar/filter-icon';
import { useSidebarContext } from '../layout/layout-context';
import { useRouter } from 'next/router';

export const SidebarWrapper = () => {
  const router = useRouter();
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <Box
      as="aside"
      css={{
        height: '100vh',
        zIndex: 202,
        position: 'sticky',
        top: '0',
      }}
    >
      {collapsed ? <Sidebar.Overlay onClick={setCollapsed} /> : null}

      <Sidebar collapsed={collapsed}>
        <Sidebar.Header>
          <CompaniesDropdown />
        </Sidebar.Header>
        <Flex
          direction={'column'}
          justify={'between'}
          css={{ height: '100%' }}
        >
          <Sidebar.Body className="body sidebar">
            <SidebarItem
              title="Home"
              icon={<HomeIcon />}
              isActive={router.pathname === '/'}
              href="/"
            />
            <SidebarMenu title="Node Management">
              <SidebarItem
                isActive={router.pathname === '/node'}
                title="Node"
                icon={<AccountsIcon />}
                href="/node"
              />
              <SidebarItem
                isActive={router.pathname === '/nodelogs'}
                title="Logs"
                icon={<PaymentsIcon />}
                href="/configuration"
              />
            </SidebarMenu>

            <SidebarMenu title="Device Management">
              <SidebarItem
                isActive={router.pathname === '/configuration'}
                title="Device"
                icon={<PaymentsIcon />}
                href="/configuration"
              />
              <CollapseItems
                icon={<BalanceIcon />}
                items={['Engrow', 'Nutrigrow', 'AWS']}
                title="Chart"
                href={['/chart/engrow', '/chart/nutrigrow', '/chart/aws']}
              />
            </SidebarMenu>

            <SidebarMenu title="Actuator Management">
              <SidebarItem
                isActive={router.pathname === '/actuator'}
                title="Actuator"
                icon={<AccountsIcon />}
                href="/actuator"
              />
            </SidebarMenu>

            <SidebarMenu title="General">
              <SidebarItem
                isActive={router.pathname === '/user'}
                title="User"
                icon={<DevIcon />}
                href="/user"
              />
              <SidebarItem
                isActive={router.pathname === '/settings'}
                title="Settings"
                icon={<SettingsIcon />}
                href="/settings"
              />
            </SidebarMenu>
          </Sidebar.Body>
          <Sidebar.Footer>
            <Tooltip content={'Settings'} rounded color="primary">
              <SettingsIcon />
            </Tooltip>
            <Tooltip content={'Adjustments'} rounded color="primary">
              <FilterIcon />
            </Tooltip>
            <Tooltip content={'Profile'} rounded color="primary">
              <Avatar
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                size={'sm'}
              />
            </Tooltip>
          </Sidebar.Footer>
        </Flex>
      </Sidebar>
    </Box>
  );
};
