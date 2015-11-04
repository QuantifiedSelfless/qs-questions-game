#!/usr/bin/env python

#	Compare current user answers (10) with other previously answered questions (30+)

def main():

	question_count = 30
	current_answers = ['1A','2B','3A','4B','5A','6A','7B','8A','9B','10B']
	stored_answers1 = ['1A','2B','3B','4A','5B',' ','7B','8A','9A','10B',' ','12B','13A',' ','15A','16A','17B','18A',' ','20B','21B',' ','23B','24B',' ','26A','27A','28B',' ','30B']
	stored_answers2 = ['1B',' ','3A','4A','5A','6B','7A','8B',' ','10A','11A','12B','13B',' ','15B',' ','17A','18B','19A',' ','21A','22B',' ','24A','25A',' ','27B','28A','29B',' ']
	stored_answers3 = ['1A','2B','3A','4B','5A','6A','7B','8A','9B','10B','11A','12B','13B',' ','15B',' ','17A','18B','19A',' ','21A','22B',' ','24A','25A',' ','27B','28A','29B',' ']
	stored_answers4 = ['1A','2B','3A','4B','5A','6A','7B','8A','9B','10B','11A','12B','13B','14A','15B','16B','17A','18B','19A','20A','21A','22B',' ','24A','25A','26B','27B','28A','29B',' ']

	stored_sets = [stored_answers1, stored_answers2, stored_answers3, stored_answers4]

	a = set(current_answers)
	current_max1 = 0
	current_max2 = 0
	current_max3 = 0
	for i in range(0,len(stored_sets)):

		b = set(stored_sets[i])
		#jaccard_index = float(len(a&b))/len(a|b) (The traditional jaccard index)
		#	Dividing by the number of questions negates having the same identifier for all unanswered questions.
		#	The maximum possible index is (len(current_answers))/(total number of questions), which in this example is 1/3 (0.333...)
		jaccard_index = float(len(a&b))/question_count
		print "INDEX: {}".format(jaccard_index)
		if(jaccard_index > current_max1):
			current_max3 = current_max2
			current_max2 = current_max1
			current_max1 = jaccard_index
		if(jaccard_index > current_max2):
			current_max3 = current_max2
			current_max2 = jaccard_index
		if(jaccard_index > current_max1):
			current_max1 = jaccard_index

	print current_max1
	print current_max2
	print current_max3

if __name__ == "__main__":
    main()