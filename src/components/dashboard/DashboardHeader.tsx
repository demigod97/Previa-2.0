
import React from 'react';
import { Box, Flex, Heading, Icon } from '@chakra-ui/react';
import { Button } from '@/components/chakra-ui/button';
import { User, LogOut } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/chakra-ui/dropdown-menu';
import { useLogout } from '@/services/authService';
import Logo from '@/components/chakra-ui/Logo';

interface DashboardHeaderProps {
  userEmail?: string;
}

const DashboardHeader = ({ userEmail }: DashboardHeaderProps) => {
  const { logout } = useLogout();

  return (
    <Box as="header" px={6} py={4} bg="previa.cream" borderBottom="1px solid" borderColor="previa.sand">
      <Flex justify="space-between" align="center">
        <Flex align="center" gap={2}>
          <Logo />
          <Heading as="h1" size="lg" fontWeight="medium" color="previa.charcoal">
            Previa
          </Heading>
        </Flex>

        <Flex align="center" gap={4}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" p={0}>
                <Flex
                  w={8}
                  h={8}
                  borderRadius="full"
                  align="center"
                  justify="center"
                  cursor="pointer"
                  transition="background 0.2s"
                  bg="previa.sand"
                  _hover={{ bg: "previa.stone" }}
                >
                  <Icon as={User} w={4} h={4} color="previa.charcoal" />
                </Flex>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" w="48" bg="previa.cream" borderColor="previa.sand">
              <DropdownMenuItem onClick={logout} cursor="pointer" color="previa.charcoal">
                <Icon as={LogOut} w={4} h={4} mr={2} />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Flex>
      </Flex>
    </Box>
  );
};

export default DashboardHeader;
