import re

def trunc_at(s, d, n=3):
    #"Returns s truncated at the n'th (3rd by default) occurrence of the delimiter, d."
    return d.join(s.split(d, n)[:n])

def getProf(a):
    b = len(a) 
    if( a[b-2] == "With"):
        return a[b-1]           
    return a[b-2] + " " + a[b-1]

def getClassName(a):
    alen = len(a)
    print(alen)
    name = a[3]
    for i in range(4,alen):
        # print(a[i])
        if a[i] == '—':
            print("here")
            break
        else:
            name = name + " " + a[i]
            print(name)
    return name

def getClassAndSection(array):
    alen = len(array)
    a = list()
    for i in range(0, alen):
        if array[i] == '—':
            a.append(i)
            print(i)
    if a[0]==3:
        name = "N/A"
        section = array[4]
        for i in range (a[0]+2, a[1]):
            print(i)
            section = section + " " + array[i]
    else:
        name = array[3]
        for i in range (4, a[0]):
            name = name + " " + array[i]
        section = array[a[0]+1]
        for i in range (a[0]+2, a[1]):
            section = section + " " + array[i]
    # arr = []
    # arr.append(name)
    # arr.append(section)
    # return arr
    return name,section

def getId(string):
    arr = string.split('/')
    return arr[len(arr)-1]

def status(string):
    regex = re.compile('28100*')
    if regex.match(string):
        stat = "N/A"
    else:
        stat = string
    return stat