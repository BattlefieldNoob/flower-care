{
  'variables': {
    'openssl_fips' : ''
  },
  'targets': [
    {
      'target_name': 'noble',
      'conditions': [
        ['OS=="mac"', {
          'dependencies': [
            'src/lib/mac/binding.gyp:binding',
          ],
        }],
        ['OS=="win"', {
          'dependencies': [
            'src/lib/win/binding.gyp:binding',
          ],
        }],
      ],
    },
  ],
}
