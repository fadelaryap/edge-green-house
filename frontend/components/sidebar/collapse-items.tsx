import { Collapse, Text, Link } from '@nextui-org/react';
import React, { useState, useEffect } from 'react';
import { ChevronUpIcon } from '../icons/sidebar/chevron-up-icon';
import { Flex } from '../styles/flex';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

interface Props {
  icon: React.ReactNode;
  title: string;
  items: string[];
  href: string[];
}

export const CollapseItems = ({ icon, items, title, href }: Props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    // Check if the current route matches any of the sub-item routes
    const activeIndex = href.findIndex((link) => router.pathname.startsWith(link));
    setIsActive(activeIndex !== -1);
    setActiveIndex(activeIndex);
  }, [router.pathname, href]);

  const handleToggle = () => setOpen(!open);

  return (
    <Flex
      css={{
        gap: '$6',
        height: '100%',
        alignItems: 'center',
        cursor: 'pointer',
      }}
      align={'center'}
    >
      <Collapse
        title={
          <Flex
            css={{
              gap: '$6',
              width: '100%',
              py: '$5',
              px: '$7',
              borderRadius: '8px',
              transition: 'all 0.15s ease',
              '&:active': {
                transform: 'scale(0.98)',
              },
              '&:hover': {
                bg: '$accents2',
              },
              ...(isActive
                ? {
                    bg: '$blue200',
                    '& svg path': {
                      fill: '$blue600',
                    },
                  }
                : { '&:hover': { bg: '$accents2' } }),
            }}
            justify={'between'}
            onClick={handleToggle}
          >
            <Flex css={{ gap: '$6' }}>
              {icon}
              <Text
                span
                weight={'normal'}
                size={'$base'}
                css={{
                  color: '$accents9',
                }}
              >
                {title}
              </Text>
            </Flex>

            <ChevronUpIcon
              css={{
                transition: 'transform 0.3s ease',
                transform: open ? 'rotate(-180deg)' : 'rotate(0deg)',
              }}
            />
          </Flex>
        }
        css={{
          width: '100%',
          '& .nextui-collapse-view': {
            p: '0',
          },
          '& .nextui-collapse-content': {
            marginTop: '$1',
            padding: '0px',
          },
        }}
        divider={false}
        showArrow={false}
      >
        {items.map((item, index) => (
          <Flex
            key={index}
            direction={'column'}
            css={{
              paddingLeft: '$16',
              bg: activeIndex === index ? '$accents2' : 'inherit',
            }}
          >
            <NextLink href={href[index]}>
              <Link
                css={{
                  color: '$accents9',
                  maxWidth: '100%',
                  '&:hover': {
                    color: '$accents9',
                  },
                }}
              >
                <Text
                  span
                  weight={'normal'}
                  size={'$md'}
                  css={{
                    color: activeIndex === index ? '$blue600' : '$accents8',
                    cursor: 'pointer',
                    '&:hover': {
                      color: '$accents9',
                    },
                  }}
                >
                  {item}
                </Text>
              </Link>
            </NextLink>
          </Flex>
        ))}
      </Collapse>
    </Flex>
  );
};
