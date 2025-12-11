from setuptools import setup, find_packages

requires = [
    'pyramid',
    'pyramid_tm',
    'sqlalchemy',
    'zope.sqlalchemy',
    'psycopg2-binary',
    'waitress',
    'alembic',
    'bcrypt',
    'pyramid_debugtoolbar'
]

setup(
    name='clinic_backend',
    version='0.1',
    packages=find_packages(),
    install_requires=requires,
    entry_points={
        'paste.app_factory': [
            'main = src:main',
        ],
    },
)