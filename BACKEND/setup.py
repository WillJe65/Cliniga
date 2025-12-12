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
    'python-dotenv'
]

dev_requires = [
    'pyramid_debugtoolbar',
    'pytest'
]

setup(
    name='clinic_backend',
    version='0.1',
    packages=find_packages(),
    install_requires=requires,
    extras_require={
        'dev' : dev_requires,
    },
    entry_points={
        'paste.app_factory': [
            'main = src:main',
        ],
    },
)