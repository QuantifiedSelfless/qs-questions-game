#!/usr/bin/env python
import csv
with open('Responses.csv', 'rb') as csvfile:
	read = csv.reader(csvfile, delimiter=',')
	i = 0
	test_dict = {}
	for row in read:
		if(i == 2):
			for n, entry in enumerate(row):
				if entry:
					#print entry[0]
					test_dict[n] = entry[0]
		i += 1
	print test_dict
